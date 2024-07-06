import { ApiProperty, PartialType } from '@nestjs/swagger';
import { CreateUserDto } from './create-user.dto';
import { IsNonBlankString } from 'src/validation/is-non-blank-string.validation';
import { ValidateIf } from 'class-validator';

export class UpdateUserDto extends PartialType(CreateUserDto) {
  @ApiProperty()
  @ValidateIf((object) => object.password)
  @IsNonBlankString()
  currentPassword?: string;
}
