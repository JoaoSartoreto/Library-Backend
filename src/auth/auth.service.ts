import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from 'src/users/users.service';
import { UserDto } from './dto/user.dto';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService
  ) {}

  async validateUser(
    email: string,
    password: string
  ): Promise<UserDto | undefined> {
    const user = await this.usersService.findByEmail(email, {
      withDeleted: true,
      selectPassword: true
    });
    if (user && (await user.comparePassword(password))) {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const { password, ...result } = user;
      return result;
    }
  }

  login(user: UserDto) {
    const payload = { sub: user.id };
    return {
      ...user,
      access_token: this.jwtService.sign(payload)
    };
  }
}
