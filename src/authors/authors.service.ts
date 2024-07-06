import {
  BadRequestException,
  Injectable,
  NotFoundException
} from '@nestjs/common';
import { CreateAuthorDto } from './dto/create-author.dto';
import { UpdateAuthorDto } from './dto/update-author.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Author } from './entities/author.entity';
import { FindOptionsWhere, ILike, Repository } from 'typeorm';
import { FindAllAuthorsQuery } from './query/find-all-authors.query';
import { paginate } from 'nestjs-typeorm-paginate';
import { FindOneAuthorQuery } from './query/find-one-author.query';

@Injectable()
export class AuthorsService {
  constructor(
    @InjectRepository(Author) private authorsRepository: Repository<Author>
  ) {}

  create(createAuthorDto: CreateAuthorDto) {
    const author = this.authorsRepository.create(createAuthorDto);
    return this.authorsRepository.save(author);
  }

  findAll(query: FindAllAuthorsQuery) {
    const options = { page: query.page, limit: query.limit };
    const where: FindOptionsWhere<Author> = {};

    if (query.search) {
      where.fullName = ILike(`%${query.search}%`);
    }

    return paginate<Author>(this.authorsRepository, options, {
      where
    });
  }

  async findOne(id: string, query?: FindOneAuthorQuery) {
    const author = await this.authorsRepository.findOne({
      where: { id },
      relations: { books: true }
    });
    if (!author) throw new NotFoundException();

    if (query?.bookTitle)
      author.books = author.books.filter((book) =>
        new RegExp(query?.bookTitle, 'i').test(book.title)
      );

    return author;
  }

  async findMany(ids: string[]) {
    /*const authors: Author[] = [];

    for (const id of ids) {
      const author = await this.authorsRepository.findOneBy({ id });

      if (!author)
        throw new BadRequestException(`author with id ${id} not found`);

      authors.push(author);
    }

    return authors;*/

    const authors = await this.authorsRepository.find({
      where: ids.map((id) => ({ id }))
    });

    if (authors.length !== ids.length) {
      for (const id of ids) {
        const valido = authors.some((reg) => reg.id === id);
        if (!valido)
          throw new BadRequestException(`author with id ${id} not found`);
      }
    }

    return authors;
  }

  async update(id: string, updateAuthorDto: UpdateAuthorDto) {
    const author = await this.findOne(id);
    const updatedAuthor = this.authorsRepository.create({
      ...author,
      ...updateAuthorDto
    });
    return this.authorsRepository.save(updatedAuthor);
  }

  async delete(id: string) {
    await this.findOne(id);
    const result = await this.authorsRepository.delete({ id });
    if (!result.affected) throw new NotFoundException();

    return true;
  }
}
