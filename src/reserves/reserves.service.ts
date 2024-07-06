/* eslint-disable @typescript-eslint/no-unused-vars */
import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  Inject,
  NotFoundException,
  forwardRef
} from '@nestjs/common';
import { Reserve } from './entities/reserve.entity';
import {
  Between,
  FindOptionsWhere,
  LessThanOrEqual,
  MoreThanOrEqual,
  Repository
} from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { FindAllReservesQuery } from './query/find-all-reserves.query';
import { paginate } from 'nestjs-typeorm-paginate';
import { UsersService } from 'src/users/users.service';
import { CreateReserveDto } from './dto/create-reserve.dto';
import { UpdateReserveDto } from './dto/update-reserve.dto';
import { BooksService } from 'src/books/books.service';
import { User } from 'src/users/entities/user.entity';
import { LibraryConfigurationsService } from 'src/library-configurations/library-configurations.service';

@Injectable()
export class ReservesService {
  constructor(
    @InjectRepository(Reserve) private reservesRepository: Repository<Reserve>,
    private usersService: UsersService,
    @Inject(forwardRef(() => BooksService)) private booksService: BooksService,
    private libraryConfigurationsService: LibraryConfigurationsService
  ) {}

  async create(userId: string, createReserveDto: CreateReserveDto) {
    await this.libraryConfigurationsService.validateBorrowingPeriod(
      createReserveDto.startDate,
      createReserveDto.endDate
    );

    this.validaReservas();
    const activeReserves = await this.reservesRepository.countBy({
      isValid: true,
      user: { id: userId }
    });

    const { maxReservesByUser } =
      await this.libraryConfigurationsService.findCurrent();

    if (activeReserves >= maxReservesByUser)
      throw new BadRequestException(
        "you've reached the limit of reserves by user"
      );

    const reserve = this.reservesRepository.create({
      ...createReserveDto,
      isValid: true
    });

    const user = await this.usersService.findById(userId);
    reserve.user = user!;

    const book = await this.booksService.findOne(createReserveDto.bookId);
    if (book.quantity > 0) {
      this.booksService.update(book.id, { quantity: book.quantity - 1 });
      reserve.book = book;
    } else throw new BadRequestException(`there is no book at the stock`);
    reserve.isValid = true;

    return this.reservesRepository.save(reserve);
  }

  async validaReservas() {
    let reserves: Reserve[] = [];
    reserves = await this.reservesRepository.find({ where: { isValid: true } });
    const hoje = new Date();
    if (reserves) {
      for (const reserve of reserves) {
        if (reserve.endDate.getTime() < hoje.getTime()) {
          this.booksService.update(reserve.book.id, {
            quantity: reserve.book.quantity + 1
          });
          reserve.isValid = false;
          this.reservesRepository.save(reserve);
        }
      }
    }
  }

  findAll(query: FindAllReservesQuery, user: User) {
    const options = { page: query.page, limit: query.limit };
    const where: FindOptionsWhere<Reserve> = {};
    const onlyValid = query.parsedOnlyValid;

    if (query.startingDateMin && query.startingDateMax) {
      where.startDate = Between(query.startingDateMin, query.startingDateMax);
    } else {
      if (query.startingDateMin)
        where.startDate = MoreThanOrEqual(query.startingDateMin);

      if (query.startingDateMax)
        where.startDate = LessThanOrEqual(query.startingDateMax);
    }
    this.validaReservas();
    if (onlyValid) {
      where.isValid = true;
    }
    if (onlyValid !== undefined && !onlyValid) {
      where.isValid = false;
    }

    if (!user.isLibrarian) {
      where.user = { id: user.id };
    }

    return paginate<Reserve>(this.reservesRepository, options, { where });
  }

  async findOne(id: string) {
    this.validaReservas();
    const reserve = await this.reservesRepository.findOneBy({ id });
    if (!reserve) throw new NotFoundException();
    return reserve;
  }

  async findOneAuth(id: string, user: User) {
    this.validaReservas();
    const reserve = await this.reservesRepository.findOneBy({ id });
    if (!reserve) throw new NotFoundException();
    if (!user.isLibrarian) {
      if (reserve.user.id !== user.id)
        throw new ForbiddenException(
          "you don't have permission to see this reserve"
        );
    }

    return reserve;
  }

  async update(id: string, updateReserveDto: UpdateReserveDto, user: User) {
    const reserve = await this.findOne(id);
    if (!user.isLibrarian) {
      if (reserve.user.id !== user.id)
        throw new ForbiddenException(
          "you don't have permission to see this reserve"
        );
    }
    const updatedReserve = this.reservesRepository.create({
      ...reserve,
      ...updateReserveDto
    });

    if (reserve.isValid && !updatedReserve.isValid) {
      this.booksService.update(reserve.book.id, {
        quantity: reserve.book.quantity + 1
      });
    }

    return this.reservesRepository.save(updatedReserve);
  }

  async delete(id: string, user: User) {
    const reserve = await this.findOne(id);
    if (!user.isLibrarian) {
      if (reserve.user.id !== user.id)
        throw new ForbiddenException(
          "you don't have permission to see this reserve"
        );
    }
    if (reserve.isValid) {
      this.booksService.update(reserve.book.id, {
        quantity: reserve.book.quantity + 1
      });
    }
    const result = await this.reservesRepository.delete({ id });
    if (!result.affected) throw new NotFoundException();

    return true;
  }
}
