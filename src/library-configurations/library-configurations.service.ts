import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  NotFoundException
} from '@nestjs/common';
import { CreateLibraryConfigurationDto } from './dto/create-library-configuration.dto';
import { UpdateLibraryConfigurationDto } from './dto/update-library-configuration.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { LibraryConfiguration } from './entities/library-configuration.entity';
import {
  Between,
  FindOptionsWhere,
  LessThanOrEqual,
  MoreThanOrEqual,
  Repository
} from 'typeorm';
import { FindAllLibraryConfigurationsQuery } from './query/find-all-library-configurations.query';
import { paginate } from 'nestjs-typeorm-paginate';

@Injectable()
export class LibraryConfigurationsService {
  constructor(
    @InjectRepository(LibraryConfiguration)
    private libraryConfigurationsRepository: Repository<LibraryConfiguration>
  ) {}

  public async initialize(): Promise<void> {
    const count = await this.libraryConfigurationsRepository.count();
    if (count === 0) {
      const config = this.libraryConfigurationsRepository.create({
        dailyFine: 3,
        maxBorrowedBooksByUser: 3,
        maxBorrowingDurationDays: 3,
        maxReservesByUser: 3,
        startingDate: new Date()
      });
      await this.libraryConfigurationsRepository.save(config);
    }
  }

  async create(createLibraryConfigurationDto: CreateLibraryConfigurationDto) {
    if (await this.findByStartDate(createLibraryConfigurationDto.startingDate))
      throw new BadRequestException(
        'already have a configuration with this starting date'
      );

    const configuration = this.libraryConfigurationsRepository.create(
      createLibraryConfigurationDto
    );
    return this.libraryConfigurationsRepository.save(configuration);
  }

  findByStartDate(startingDate: Date) {
    return this.libraryConfigurationsRepository.findOneBy({ startingDate });
  }

  findAll(query: FindAllLibraryConfigurationsQuery) {
    const options = { page: query.page, limit: query.limit };
    const where: FindOptionsWhere<LibraryConfiguration> = {};

    if (query.startingDateMin && query.startingDateMax) {
      where.startingDate = Between(
        query.startingDateMin,
        query.startingDateMax
      );
    } else {
      if (query.startingDateMin)
        where.startingDate = MoreThanOrEqual(query.startingDateMin);

      if (query.startingDateMax)
        where.startingDate = LessThanOrEqual(query.startingDateMax);
    }

    return paginate<LibraryConfiguration>(
      this.libraryConfigurationsRepository,
      options,
      { where }
    );
  }

  async findOne(id: string) {
    const libraryConfiguration =
      await this.libraryConfigurationsRepository.findOneBy({ id });

    if (!libraryConfiguration) throw new NotFoundException();

    return libraryConfiguration;
  }

  async findCurrent() {
    const currentConfiguration =
      await this.libraryConfigurationsRepository.findOne({
        where: { startingDate: LessThanOrEqual(new Date()) },
        order: { startingDate: 'DESC' }
      });
    if (!currentConfiguration) throw new InternalServerErrorException();
    return currentConfiguration;
  }

  async update(
    id: string,
    updateLibraryConfigurationDto: UpdateLibraryConfigurationDto
  ) {
    const libraryConfiguration = await this.findOne(id);

    if (libraryConfiguration.startingDate.getTime() <= Date.now())
      throw new BadRequestException(
        'you cannot update a configuration that was or is in use'
      );

    if (
      updateLibraryConfigurationDto.startingDate &&
      updateLibraryConfigurationDto.startingDate !=
        libraryConfiguration.startingDate &&
      (await this.findByStartDate(updateLibraryConfigurationDto.startingDate))
    )
      throw new BadRequestException(
        'already have a configuration with this starting date'
      );

    const updatedConfiguration = this.libraryConfigurationsRepository.create({
      ...libraryConfiguration,
      ...updateLibraryConfigurationDto
    });
    return this.libraryConfigurationsRepository.save(updatedConfiguration);
  }

  async delete(id: string) {
    const libraryConfiguration = await this.findOne(id);

    if (libraryConfiguration.startingDate.getTime() <= Date.now())
      throw new BadRequestException(
        'you cannot delete a configuration that was or is in use'
      );

    const result = await this.libraryConfigurationsRepository.delete({ id });
    if (!result.affected) throw new NotFoundException();

    return true;
  }

  async validateBorrowingPeriod(startDate: Date, endDate: Date) {
    const { maxBorrowingDurationDays } = await this.findCurrent();
    const day = 1000 * 60 * 60 * 24;

    const startOfStartDate = new Date(startDate);
    startOfStartDate.setHours(0, 0, 0, 0);

    const endOfEndDate = new Date(endDate);
    endOfEndDate.setHours(23, 59, 59, 999);

    const duration =
      (endOfEndDate.getTime() - startOfStartDate.getTime()) / day;

    if (duration >= maxBorrowingDurationDays) {
      throw new BadRequestException(
        `the maximum duration of a borrowing is ${maxBorrowingDurationDays} days`
      );
    }
  }
}
