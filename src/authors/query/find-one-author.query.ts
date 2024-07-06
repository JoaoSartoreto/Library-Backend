import { ApiProperty } from '@nestjs/swagger';
import { IsOptional } from 'class-validator';
import { IsNonBlankString } from 'src/validation/is-non-blank-string.validation';

export class FindOneAuthorQuery {
  @ApiProperty({ required: false })
  @IsOptional()
  @IsNonBlankString()
  bookTitle: string;
}
