import { ApiProperty } from '@nestjs/swagger';
import { IsDate, IsNotEmpty, IsOptional } from 'class-validator';
import { PaginationQuery } from 'src/pagination/pagination.query';

export class FindAllLibraryConfigurationsQuery extends PaginationQuery {
  @ApiProperty({ required: false })
  @IsOptional()
  @IsDate()
  @IsNotEmpty()
  startingDateMin: Date;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsDate()
  @IsNotEmpty()
  startingDateMax: Date;
}
