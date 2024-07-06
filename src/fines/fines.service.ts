import {
  BadRequestException,
  Injectable,
  NotFoundException
} from '@nestjs/common';
import { CreateFineDto } from './dto/create-fine.dto';
import { InjectRepository } from '@nestjs/typeorm';
import {
  Between,
  FindOptionsWhere,
  LessThanOrEqual,
  MoreThanOrEqual,
  Repository
} from 'typeorm';
import { Fine } from './entities/fine.entity';
import { FindAllFinesQuery } from './query/find-all-fines.query';
import { Borrowing } from 'src/borrowings/entities/borrowing.entity';
import { User } from 'src/users/entities/user.entity';

@Injectable()
export class FinesService {
  constructor(
    @InjectRepository(Fine) private finesRepository: Repository<Fine>
  ) {}

  async create(createFineDto: CreateFineDto, borrowing: Borrowing) {
    const fine = this.finesRepository.create({ ...createFineDto, borrowing });
    fine.isPaid = false;
    return this.finesRepository.save(fine);
  }

  async findAll(query: FindAllFinesQuery, user: User) {
    const options = { page: query.page, limit: query.limit };
    const where: FindOptionsWhere<Fine> = {};
    const isPaid = query.parsedIsPaid;

    if (query.startingDateMin && query.startingDateMax) {
      where.startDate = Between(query.startingDateMin, query.startingDateMax);
    } else {
      if (query.startingDateMin)
        where.startDate = MoreThanOrEqual(query.startingDateMin);

      if (query.startingDateMax)
        where.startDate = LessThanOrEqual(query.startingDateMax);
    }
    if (isPaid) {
      where.isPaid = true;
    }
    if (isPaid !== undefined && !isPaid) {
      where.isPaid = false;
    }
    if (!user.isLibrarian) {
      where.borrowing = {
        user: {
          id: user.id
        }
      };
    }

    const [results, total] = await this.finesRepository.findAndCount({
      where,
      relations: ['borrowing'], // Carregamento antecipado da entidade Borrowing
      take: options.limit,
      skip: options.page ? (options.page - 1) * options.limit : 0
    });

    return {
      items: results,
      meta: {
        totalItems: total,
        itemsPerPage: options.limit,
        currentPage: options.page
      }
    };
  }

  async findOneFull(id: string, user: User) {
    let fine;
    if (!user.isLibrarian) {
      const options = {
        where: {
          id: id,
          borrowing: {
            user: {
              id: user.id
            }
          }
        },
        relations: ['borrowing']
      };

      fine = await this.finesRepository.findOne(options);
    } else {
      fine = await this.finesRepository.findOne({
        where: {
          id: id
        },
        relations: ['borrowing']
      });
    }

    if (!fine) {
      throw new NotFoundException('Registro de multa não encontrado');
    }

    return fine;
  }

  async findOne(id: string) {
    const fine = await this.finesRepository.findOneBy({ id });
    if (!fine) throw new NotFoundException();
    return fine;
  }

  async findByUser(userId: string) {
    return this.finesRepository.findBy({
      borrowing: { user: { id: userId } },
      isPaid: false
    });
  }

  async payFine(id: string) {
    const fine = await this.findOne(id);
    if (fine.isPaid) throw new BadRequestException('fine is already');
    fine.isPaid = true;
    fine.endDate = new Date();
    return this.finesRepository.save(fine);
  }
}
