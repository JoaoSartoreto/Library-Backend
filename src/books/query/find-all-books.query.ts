import { ApiProperty } from '@nestjs/swagger';
import { IsNumber, IsOptional } from 'class-validator';
import { PaginationQuery } from 'src/pagination/pagination.query';
import { IsNonBlankString } from 'src/validation/is-non-blank-string.validation';

export class FindAllBooksQuery extends PaginationQuery {
  @ApiProperty({ required: false })
  @IsOptional()
  @IsNonBlankString()
  title: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsNonBlankString()
  language: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsNumber()
  year: number;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsNonBlankString()
  authorName: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsNonBlankString()
  tagName: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsNonBlankString()
  categoryName: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsNonBlankString()
  publisherName: string;
}
