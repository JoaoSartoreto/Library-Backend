import { ApiProperty } from '@nestjs/swagger';
import { IsOptional } from 'class-validator';
import { PaginationQuery } from 'src/pagination/pagination.query';
import { IsNonBlankString } from 'src/validation/is-non-blank-string.validation';

export class FindAllPublishersQuery extends PaginationQuery {
  @ApiProperty({ required: false })
  @IsOptional()
  @IsNonBlankString()
  search: string;
}
