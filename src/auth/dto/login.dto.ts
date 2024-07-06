import { ApiProperty } from '@nestjs/swagger';
import { IsEmail } from 'class-validator';
import { IsNonBlankString } from 'src/validation/is-non-blank-string.validation';

export class LoginDto {
  @ApiProperty()
  @IsEmail()
  @IsNonBlankString()
  email: string;

  @ApiProperty()
  @IsNonBlankString()
  password: string;
}
