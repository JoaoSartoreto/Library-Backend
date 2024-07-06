import {
  BadRequestException,
  Injectable,
  NotFoundException
} from '@nestjs/common';
import { CreateTagDto } from './dto/create-tag.dto';
import { UpdateTagDto } from './dto/update-tag.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Tag } from './entities/tag.entity';
import { FindOptionsWhere, ILike, Repository } from 'typeorm';
import { FindAllTagsQuery } from './query/find-all-tags.query';
import { paginate } from 'nestjs-typeorm-paginate';

@Injectable()
export class TagsService {
  constructor(@InjectRepository(Tag) private tagsRepository: Repository<Tag>) {}

  async create(createTagDto: CreateTagDto) {
    if (await this.findByName(createTagDto.name))
      throw new BadRequestException(`name already in use`);

    const tag = this.tagsRepository.create(createTagDto);
    return this.tagsRepository.save(tag);
  }

  findAll(query: FindAllTagsQuery) {
    const options = { page: query.page, limit: query.limit };
    const where: FindOptionsWhere<Tag> = {};

    if (query.search) {
      where.name = ILike(`%${query.search}%`);
    }

    return paginate<Tag>(this.tagsRepository, options, { where });
  }

  async findOne(id: string) {
    const tag = await this.tagsRepository.findOneBy({ id });
    if (!tag) throw new NotFoundException();
    return tag;
  }

  async findOneFull(id: string) {
    const tag = await this.tagsRepository
      .createQueryBuilder('tag')
      .leftJoinAndSelect('tag.books', 'book')
      .where('tag.id = :id', { id: id })
      .getOne();
    if (!tag) throw new NotFoundException();

    return tag;
  }

  async findMany(ids: string[]) {
    /*const tags: Tag[] = [];

    for (const id of ids) {
      const tag = await this.tagsRepository.findOneBy({ id });

      if (!tag) throw new BadRequestException(`tag with id ${id} not found`);

      tags.push(tag);
    }

    return tags;*/

    const tags = await this.tagsRepository.find({
      where: ids.map((id) => ({ id }))
    });

    if (tags.length !== ids.length) {
      for (const id of ids) {
        const valido = tags.some((reg) => reg.id === id);
        if (!valido)
          throw new BadRequestException(`tag with id ${id} not found`);
      }
    }

    return tags;
  }

  findByName(name: string) {
    return this.tagsRepository.findOneBy({ name });
  }

  async update(id: string, updateTagDto: UpdateTagDto) {
    if (updateTagDto.name && (await this.findByName(updateTagDto.name)))
      throw new BadRequestException(`name already in use`);

    const tag = await this.findOne(id);
    const updatedTag = this.tagsRepository.create({
      ...tag,
      ...updateTagDto
    });
    return this.tagsRepository.save(updatedTag);
  }

  async delete(id: string) {
    await this.findOne(id);
    const result = await this.tagsRepository.delete({ id });
    if (!result.affected) throw new NotFoundException();

    return true;
  }
}
