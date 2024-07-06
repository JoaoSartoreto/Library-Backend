import { ApiProperty } from '@nestjs/swagger';
import { IsBoolean, IsEmail, MinLength } from 'class-validator';
import { IsNonBlankString } from 'src/validation/is-non-blank-string.validation';

export class CreateUserDto {
  @ApiProperty()
  @IsEmail()
  @IsNonBlankString()
  email: string;

  @ApiProperty()
  @MinLength(8)
  @IsNonBlankString()
  password: string;

  @ApiProperty()
  @IsNonBlankString()
  passwordConfirmation: string;

  @ApiProperty()
  @IsNonBlankString()
  fullName: string;

  @ApiProperty()
  @IsBoolean()
  isLibrarian: boolean;
}
