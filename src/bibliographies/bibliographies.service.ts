import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateBibliographyDto } from './dto/create-bibliography.dto';
import { UpdateBibliographyDto } from './dto/update-bibliography.dto';
import { Bibliography } from './entities/bibliography.entity';
import { FindOptionsWhere, ILike, Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { FindAllBibliographiesQuery } from './query/find-all-bibliographies.query';
import { paginate } from 'nestjs-typeorm-paginate';
import { BooksService } from 'src/books/books.service';

@Injectable()
export class BibliographiesService {
  constructor(
    @InjectRepository(Bibliography)
    private bibliographiesRepository: Repository<Bibliography>,
    private booksService: BooksService
  ) {}

  async create(createBibliographyDto: CreateBibliographyDto) {
    const bibliography = this.bibliographiesRepository.create(
      createBibliographyDto
    );
    bibliography.books = await this.booksService.findMany(
      createBibliographyDto.bookIds
    );
    return this.bibliographiesRepository.save(bibliography);
  }

  findAll(query: FindAllBibliographiesQuery) {
    const options = { page: query.page, limit: query.limit };
    const where: FindOptionsWhere<Bibliography> = {};

    if (query.search) {
      where.description = ILike(`%${query.search}%`);
    }

    return paginate<Bibliography>(this.bibliographiesRepository, options, {
      where
    });
  }

  async findOne(id: string) {
    const bibliography = await this.bibliographiesRepository.findOneBy({ id });
    if (!bibliography) throw new NotFoundException();
    return bibliography;
  }

  async findOneFull(id: string) {
    const bibliography = await this.bibliographiesRepository
      .createQueryBuilder('bibliography')
      .leftJoinAndSelect('bibliography.books', 'book')
      .where('bibliography.id = :id', { id: id })
      .getOne();
    if (!bibliography) throw new NotFoundException();
    return bibliography;
  }

  async update(id: string, updateBibliographyDto: UpdateBibliographyDto) {
    const bibliography = await this.findOne(id);

    if (updateBibliographyDto.bookIds) {
      bibliography.books = await this.booksService.findMany(
        updateBibliographyDto.bookIds
      );
    }
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { bookIds, ...rest } = updateBibliographyDto;

    const updatedBibliography = this.bibliographiesRepository.create({
      ...bibliography,
      ...rest
    });
    return this.bibliographiesRepository.save(updatedBibliography);
  }

  async delete(id: string) {
    await this.findOne(id);
    const result = await this.bibliographiesRepository.delete({ id });
    if (!result.affected) throw new NotFoundException();

    return true;
  }
}
