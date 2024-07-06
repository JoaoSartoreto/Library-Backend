import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  NotFoundException
} from '@nestjs/common';
import { CreateBorrowingDto } from './dto/create-borrowing.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Borrowing } from './entities/borrowing.entity';
import {
  Between,
  FindOptionsWhere,
  LessThanOrEqual,
  MoreThanOrEqual,
  Repository
} from 'typeorm';
import { UsersService } from 'src/users/users.service';
import { BooksService } from 'src/books/books.service';
import { FindAllBorrowingsQuery } from './query/find-all-borrowings.query';
import { paginate } from 'nestjs-typeorm-paginate';
import { LibraryConfigurationsService } from 'src/library-configurations/library-configurations.service';
import { FinesService } from 'src/fines/fines.service';
import { User } from 'src/users/entities/user.entity';

@Injectable()
export class BorrowingsService {
  constructor(
    @InjectRepository(Borrowing)
    private borrowingsRepository: Repository<Borrowing>,
    private usersService: UsersService,
    private booksService: BooksService,
    private finesService: FinesService,
    private libraryConfigurationsService: LibraryConfigurationsService
  ) {}

  async create(createBorrowingDto: CreateBorrowingDto) {
    await this.libraryConfigurationsService.validateBorrowingPeriod(
      createBorrowingDto.startDate,
      createBorrowingDto.endDate
    );

    const user = await this.usersService.findByEmail(createBorrowingDto.email);
    if (!user) throw new BadRequestException('user not found');

    const fine = await this.finesService.findByUser(user.id);
    if (fine.length > 0)
      throw new BadRequestException('the user have fines to pay');

    const activeBorrowings = await this.borrowingsRepository.countBy({
      isReturned: false,
      user: { id: user.id }
    });

    const { maxBorrowedBooksByUser } =
      await this.libraryConfigurationsService.findCurrent();

    if (activeBorrowings >= maxBorrowedBooksByUser)
      throw new BadRequestException(
        "you've reached the limit of borrowings by user"
      );

    const borrowing = this.borrowingsRepository.create(createBorrowingDto);
    borrowing.user = user;
    borrowing.isReturned = false;

    const book = await this.booksService.findOne(createBorrowingDto.bookId);
    if (book.quantity >= 1)
      borrowing.book = await this.booksService.update(book.id, {
        quantity: book.quantity - 1
      });
    else throw new BadRequestException(`there is no book at the stock`);

    return this.borrowingsRepository.save(borrowing);
  }

  findAll(query: FindAllBorrowingsQuery, user: User) {
    const options = { page: query.page, limit: query.limit };
    const where: FindOptionsWhere<Borrowing> = {};
    const isReturned = query.parsedIsReturned;

    if (query.startingDateMin && query.startingDateMax) {
      where.startDate = Between(query.startingDateMin, query.startingDateMax);
    } else {
      if (query.startingDateMin)
        where.startDate = MoreThanOrEqual(query.startingDateMin);

      if (query.startingDateMax)
        where.startDate = LessThanOrEqual(query.startingDateMax);
    }

    if (isReturned) {
      where.isReturned = true;
    }
    if (isReturned !== undefined && !isReturned) {
      where.isReturned = false;
    }

    if (!user.isLibrarian) {
      where.user = { id: user.id };
    }

    return paginate<Borrowing>(this.borrowingsRepository, options, { where });
  }

  async findOne(id: string) {
    const borrowing = await this.borrowingsRepository.findOneBy({ id });
    if (!borrowing) throw new NotFoundException();
    return borrowing;
  }

  async findOneAuth(id: string, user: User) {
    const borrowing = await this.borrowingsRepository.findOneBy({ id });
    if (!borrowing) throw new NotFoundException();
    if (!user.isLibrarian) {
      if (borrowing.user.id !== user.id)
        throw new ForbiddenException(
          "you don't have permission to see this borrowing"
        );
    }

    return borrowing;
  }

  async returnBorrowing(id: string) {
    const borrowing = await this.findOne(id);
    borrowing.isReturned = true;

    /* TODO: Criar a multa se necessário */
    const { dailyFine } = await this.libraryConfigurationsService.findCurrent();
    const book = await this.booksService.findOne(borrowing.book.id);
    this.booksService.update(book.id, { quantity: book.quantity + 1 });
    borrowing.returnDate = new Date();
    if (borrowing.returnDate > borrowing.endDate) {
      this.finesService.create(
        {
          startDate: borrowing.endDate,
          dailyFine: dailyFine
        },
        borrowing
      );
    }
    return this.borrowingsRepository.save(borrowing);
  }
}
