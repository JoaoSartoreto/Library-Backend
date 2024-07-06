import { ApiProperty } from '@nestjs/swagger';
import { IsNonBlankString } from 'src/validation/is-non-blank-string.validation';

export class CreatePublisherDto {
  @ApiProperty()
  @IsNonBlankString()
  name: string;

  @ApiProperty()
  @IsNonBlankString()
  country: string;
}
