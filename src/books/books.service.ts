import {
  BadRequestException,
  Inject,
  Injectable,
  NotFoundException,
  forwardRef
} from '@nestjs/common';
import { CreateBookDto } from './dto/create-book.dto';
import { UpdateBookDto } from './dto/update-book.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Book } from './entities/book.entity';
import { FindOptionsWhere, ILike, Repository } from 'typeorm';
import { FindAllBooksQuery } from './query/find-all-books.query';
import { paginate } from 'nestjs-typeorm-paginate';
import { AuthorsService } from 'src/authors/authors.service';
import { TagsService } from 'src/tags/tags.service';
import { CategoriesService } from 'src/categories/categories.service';
import { PublishersService } from 'src/publishers/publishers.service';
import { ReservesService } from 'src/reserves/reserves.service';

@Injectable()
export class BooksService {
  constructor(
    @InjectRepository(Book) private booksRepository: Repository<Book>,
    private authorsService: AuthorsService,
    private tagsService: TagsService,
    private categoriesService: CategoriesService,
    private publishersService: PublishersService,
    @Inject(forwardRef(() => ReservesService))
    private reservesService: ReservesService
  ) {}

  async create(createBookDto: CreateBookDto) {
    if (await this.findByIsbn(createBookDto.isbn))
      throw new BadRequestException('isbn already in use');

    const newBook = this.booksRepository.create(createBookDto);

    newBook.authors = await this.authorsService.findMany(
      createBookDto.authorIds
    );

    newBook.tags = await this.tagsService.findMany(createBookDto.tagIds);

    newBook.categories = await this.categoriesService.findMany(
      createBookDto.categoryIds
    );

    newBook.publisher = await this.publishersService.findOne(
      createBookDto.publisherId
    );

    return this.booksRepository.save(newBook);
  }

  findByIsbn(isbn: string) {
    return this.booksRepository.findOneBy({ isbn });
  }

  findAll(query: FindAllBooksQuery) {
    const options = { page: query.page, limit: query.limit };
    const where: FindOptionsWhere<Book> = {};
    this.reservesService.validaReservas();
    if (query.title) {
      where.title = ILike(`%${query.title}%`);
    }
    if (query.language) {
      where.language = ILike(`%${query.language}%`);
    }
    if (query.year) {
      where.year = query.year;
    }
    if (query.authorName) {
      where.authors = {
        fullName: ILike(`%${query.authorName}%`)
      };
    }
    if (query.categoryName) {
      where.categories = {
        name: ILike(`%${query.categoryName}%`)
      };
    }
    if (query.tagName) {
      where.tags = {
        name: ILike(`%${query.tagName}%`)
      };
    }
    if (query.publisherName) {
      where.publisher = {
        name: ILike(`%${query.publisherName}%`)
      };
    }

    return paginate<Book>(this.booksRepository, options, { where });
  }

  async findMany(ids: string[]) {
    /*const books: Book[] = [];

    for (const id of ids) {
      const book = await this.booksRepository.findOneBy({ id });

      if (!book) throw new BadRequestException(`book with id ${id} not found`);

      books.push(book);
    }

    return books;*/

    const books = await this.booksRepository.find({
      where: ids.map((id) => ({ id }))
    });

    if (books.length !== ids.length) {
      for (const id of ids) {
        const valido = books.some((reg) => reg.id === id);
        if (!valido)
          throw new BadRequestException(`book with id ${id} not found`);
      }
    }

    return books;
  }

  async findOne(id: string) {
    this.reservesService.validaReservas();
    const book = await this.booksRepository.findOneBy({ id });
    if (!book) throw new NotFoundException(`there is no book with id ${id}`);
    return book;
  }

  async update(id: string, updateBookDto: UpdateBookDto) {
    const book = await this.findOne(id);

    if (updateBookDto.authorIds) {
      book.authors = await this.authorsService.findMany(
        updateBookDto.authorIds
      );
    }
    if (updateBookDto.tagIds) {
      book.tags = await this.tagsService.findMany(updateBookDto.tagIds);
    }
    if (updateBookDto.categoryIds) {
      book.categories = await this.categoriesService.findMany(
        updateBookDto.categoryIds
      );
    }
    if (updateBookDto.publisherId) {
      book.publisher = await this.publishersService.findOne(
        updateBookDto.publisherId
      );
    }

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { authorIds, tagIds, categoryIds, publisherId, ...rest } =
      updateBookDto;
    const updatedBook = this.booksRepository.create({
      ...book,
      ...rest
    });
    return this.booksRepository.save(updatedBook);
  }

  async delete(id: string) {
    await this.findOne(id);
    const result = await this.booksRepository.delete({ id });
    if (!result.affected) throw new NotFoundException();

    return true;
  }
}
