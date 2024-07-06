import {
  BadRequestException,
  Injectable,
  NotFoundException
} from '@nestjs/common';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Category } from './entities/category.entity';
import { FindOptionsWhere, ILike, Repository } from 'typeorm';
import { FindAllCategoriesQuery } from './query/find-all-categories.query';
import { paginate } from 'nestjs-typeorm-paginate';

@Injectable()
export class CategoriesService {
  constructor(
    @InjectRepository(Category)
    private categoriesRepository: Repository<Category>
  ) {}

  async create(createCategoryDto: CreateCategoryDto) {
    if (await this.findByName(createCategoryDto.name))
      throw new BadRequestException(`name already in use`);
    const category = this.categoriesRepository.create(createCategoryDto);
    return this.categoriesRepository.save(category);
  }

  findAll(query: FindAllCategoriesQuery) {
    const options = { page: query.page, limit: query.limit };
    const where: FindOptionsWhere<Category> = {};

    if (query.search) {
      where.name = ILike(`%${query.search}%`);
    }

    return paginate<Category>(this.categoriesRepository, options, { where });
  }

  async findOne(id: string) {
    const category = await this.categoriesRepository.findOneBy({ id });
    if (!category) throw new NotFoundException();

    return category;
  }

  async findOneFull(id: string) {
    const category = await this.categoriesRepository
      .createQueryBuilder('category')
      .leftJoinAndSelect('category.books', 'book')
      .where('category.id = :id', { id: id })
      .getOne();
    if (!category) throw new NotFoundException();

    return category;
  }

  async findMany(ids: string[]) {
    /*const categories: Category[] = [];

    for (const id of ids) {
      const category = await this.categoriesRepository.findOneBy({ id });

      if (!category)
        throw new BadRequestException(`category with id ${id} not found`);

      categories.push(category);
    }

    return categories;*/

    const categories = await this.categoriesRepository.find({
      where: ids.map((id) => ({ id }))
    });

    if (categories.length !== ids.length) {
      for (const id of ids) {
        const valido = categories.some((reg) => reg.id === id);
        if (!valido)
          throw new BadRequestException(`category with id ${id} not found`);
      }
    }

    return categories;
  }

  findByName(name: string) {
    return this.categoriesRepository.findOneBy({ name });
  }

  async update(id: string, updateCategoryDto: UpdateCategoryDto) {
    if (
      updateCategoryDto.name &&
      (await this.findByName(updateCategoryDto.name))
    )
      throw new BadRequestException(`name already in use`);

    const category = await this.findOne(id);
    const updatedCategory = this.categoriesRepository.create({
      ...category,
      ...updateCategoryDto
    });
    return this.categoriesRepository.save(updatedCategory);
  }

  async delete(id: string) {
    await this.findOne(id);
    const result = await this.categoriesRepository.delete({ id });
    if (!result.affected) throw new NotFoundException();

    return true;
  }
}
