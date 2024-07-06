import { ApiProperty } from '@nestjs/swagger';
import {
  IsArray,
  IsDefined,
  IsInt,
  IsNotEmpty,
  IsPositive,
  IsString,
  IsUUID
} from 'class-validator';
import { IsNonBlankString } from 'src/validation/is-non-blank-string.validation';

export class CreateBookDto {
  @ApiProperty()
  @IsNonBlankString()
  isbn: string;

  @ApiProperty()
  @IsNonBlankString()
  title: string;

  @ApiProperty()
  @IsNonBlankString()
  language: string;

  @ApiProperty()
  @IsPositive()
  @IsInt()
  @IsDefined()
  year: number;

  @ApiProperty()
  @IsPositive()
  @IsInt()
  @IsDefined()
  edition: number;

  @ApiProperty()
  @IsPositive()
  @IsInt()
  @IsDefined()
  quantity: number;

  @ApiProperty()
  @IsArray()
  @IsString({ each: true })
  @IsNotEmpty({ each: true })
  @IsUUID(undefined, { each: true })
  authorIds: string[];

  @ApiProperty()
  @IsArray()
  @IsString({ each: true })
  @IsNotEmpty({ each: true })
  @IsUUID(undefined, { each: true })
  tagIds: string[];

  @ApiProperty()
  @IsArray()
  @IsString({ each: true })
  @IsNotEmpty({ each: true })
  @IsUUID(undefined, { each: true })
  categoryIds: string[];

  @ApiProperty()
  @IsNonBlankString()
  @IsUUID(undefined)
  publisherId: string;
}
