import { ApiProperty } from '@nestjs/swagger';
import { IsNonBlankString } from 'src/validation/is-non-blank-string.validation';

export class CreateAuthorDto {
  @ApiProperty()
  @IsNonBlankString()
  fullName: string;
}
