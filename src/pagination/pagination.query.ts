import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsPositive, IsNumber } from 'class-validator';

export class PaginationQuery {
  @ApiProperty({ required: false })
  @IsOptional()
  @IsPositive()
  @IsNumber()
  page: number = 1;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsPositive()
  @IsNumber()
  limit: number = 10;
}
