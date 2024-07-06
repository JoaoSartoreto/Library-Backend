import { ApiProperty } from '@nestjs/swagger';
import { IsArray, IsNotEmpty, IsString, IsUUID } from 'class-validator';
import { IsNonBlankString } from 'src/validation/is-non-blank-string.validation';

export class CreateBibliographyDto {
  @ApiProperty()
  @IsNonBlankString()
  description: string;

  @ApiProperty()
  @IsArray()
  @IsString({ each: true })
  @IsNotEmpty({ each: true })
  @IsUUID(undefined, { each: true })
  bookIds: string[];
}
