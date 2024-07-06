import { Injectable, NotFoundException } from '@nestjs/common';
import { CreatePublisherDto } from './dto/create-publisher.dto';
import { UpdatePublisherDto } from './dto/update-publisher.dto';
import { Publisher } from './entities/publisher.entity';
import { FindOptionsWhere, ILike, Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { FindAllPublishersQuery } from './query/find-all-publisher.query';
import { paginate } from 'nestjs-typeorm-paginate';

@Injectable()
export class PublishersService {
  constructor(
    @InjectRepository(Publisher)
    private publishersRepository: Repository<Publisher>
  ) {}
  async create(createPublisherDto: CreatePublisherDto) {
    const publisher = this.publishersRepository.create(createPublisherDto);
    return this.publishersRepository.save(publisher);
  }

  findAll(query: FindAllPublishersQuery) {
    const options = { page: query.page, limit: query.limit };
    const where: FindOptionsWhere<Publisher> = {};

    if (query.search) {
      where.name = ILike(`%${query.search}%`);
    }

    return paginate<Publisher>(this.publishersRepository, options, { where });
  }

  async findOneFull(id: string) {
    const publisher = await this.publishersRepository
      .createQueryBuilder('publisher')
      .leftJoinAndSelect('publisher.books', 'book')
      .where('publisher.id = :id', { id: id })
      .getOne();
    if (!publisher) throw new NotFoundException();
    return publisher;
  }

  async findOne(id: string) {
    const publisher = await this.publishersRepository.findOneBy({ id });
    if (!publisher) throw new NotFoundException();
    return publisher;
  }

  async update(id: string, updatePublisherDto: UpdatePublisherDto) {
    const publisher = await this.findOne(id);
    const updatedPublisher = this.publishersRepository.create({
      ...publisher,
      ...updatePublisherDto
    });
    return this.publishersRepository.save(updatedPublisher);
  }

  async delete(id: string) {
    await this.findOne(id);
    const result = await this.publishersRepository.delete({ id });
    if (!result.affected) throw new NotFoundException();

    return true;
  }
}
