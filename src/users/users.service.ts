import {
  BadRequestException,
  Injectable,
  NotFoundException
} from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { Repository } from 'typeorm';
import { UpdateUserDto } from './dto/update-user.dto';

class FindOptions {
  selectPassword?: boolean;
  withDeleted?: boolean;
}

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User) private usersRepository: Repository<User>
  ) {}

  async create(createUserDto: CreateUserDto) {
    const errors: string[] = [];

    if (await this.findByEmail(createUserDto.email, { withDeleted: true }))
      errors.push('email already in use');

    if (createUserDto.password !== createUserDto.passwordConfirmation)
      errors.push("passwords don't match");

    if (errors.length) throw new BadRequestException(errors);

    const user = await this.usersRepository.create(createUserDto);
    await user.hashPassword();
    await this.usersRepository.save(user);
  }

  async update(id: string, updateUserDto: UpdateUserDto) {
    const user = await this.findById(id, { selectPassword: true });

    if (!user) throw new NotFoundException();

    const errors: string[] = [];

    if (
      updateUserDto.email &&
      updateUserDto.email !== user.email &&
      (await this.findByEmail(updateUserDto.email, { withDeleted: true }))
    )
      errors.push('email already in use');

    if (updateUserDto.password) {
      if (updateUserDto.password !== updateUserDto.passwordConfirmation)
        errors.push("passwords don't match");

      if (!(await user.comparePassword(updateUserDto.currentPassword!)))
        errors.push('wrong current password');

      user.passwordUpdateDate = new Date();
    }

    const updatedUser = await this.usersRepository.create({
      ...user,
      ...updateUserDto
    });
    if (updateUserDto.password) await updatedUser.hashPassword();
    await this.usersRepository.save(updatedUser);

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { password, ...update } = updatedUser;
    return update;
  }

  async delete(id: string) {
    const deleted = await this.usersRepository.softDelete({ id });
    if (!deleted.affected) throw new NotFoundException();

    return true;
  }

  async restore(email: string) {
    return this.usersRepository.restore({ email });
  }

  async findByEmail(email: string, options: FindOptions = {}) {
    const user = await this.usersRepository.findOne({
      where: { email },
      withDeleted: options.withDeleted
    });

    if (user && options.selectPassword) {
      user.password = (await this.getPassword(user.id))!;
    }

    return user;
  }

  async findById(id: string, options: FindOptions = {}) {
    const user = await this.usersRepository.findOne({
      where: { id },
      withDeleted: options.withDeleted
    });

    if (user && options.selectPassword) {
      user.password = (await this.getPassword(id))!;
    }

    return user;
  }

  async getPassword(id: string) {
    return (
      await this.usersRepository.findOne({
        where: { id },
        withDeleted: true,
        select: { password: true }
      })
    )?.password;
  }

  async getUserPasswordUpdateDate(id: string) {
    return (
      await this.usersRepository.findOne({
        where: { id },
        select: { passwordUpdateDate: true }
      })
    )?.passwordUpdateDate;
  }

  async getUserDeleteDate(id: string) {
    return (
      await this.usersRepository.findOne({
        where: { id },
        withDeleted: true,
        select: { deleteDate: true }
      })
    )?.deleteDate;
  }
}
