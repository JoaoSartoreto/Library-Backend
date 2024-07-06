import { ApiProperty } from '@nestjs/swagger';
import {
  IsDate,
  IsDefined,
  IsInt,
  IsNotEmpty,
  IsNumber,
  MinDate
} from 'class-validator';

export class CreateLibraryConfigurationDto {
  @ApiProperty()
  @MinDate(new Date(), { message: '$property must be after now' })
  @IsDate()
  @IsNotEmpty()
  startingDate: Date;

  @ApiProperty()
  @IsNumber()
  @IsDefined()
  dailyFine: number;

  @ApiProperty()
  @IsInt()
  @IsDefined()
  maxBorrowedBooksByUser: number;

  @ApiProperty()
  @IsInt()
  @IsDefined()
  maxBorrowingDurationDays: number;

  @ApiProperty()
  @IsInt()
  @IsDefined()
  maxReservesByUser: number;
}
