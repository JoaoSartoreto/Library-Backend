import { ApiProperty } from '@nestjs/swagger';
import { IsDate, IsUUID } from 'class-validator';
import { IsNonBlankString } from 'src/validation/is-non-blank-string.validation';

export class CreateReserveDto {
  @ApiProperty()
  @IsDate()
  startDate: Date;

  @ApiProperty()
  @IsDate()
  endDate: Date;

  @ApiProperty()
  @IsNonBlankString()
  @IsUUID(undefined)
  bookId: string;
}
