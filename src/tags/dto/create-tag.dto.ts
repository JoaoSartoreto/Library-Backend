import { ApiProperty } from '@nestjs/swagger';
import { IsNonBlankString } from 'src/validation/is-non-blank-string.validation';

export class CreateTagDto {
  @ApiProperty()
  @IsNonBlankString()
  name: string;
}
