import { ApiProperty } from '@nestjs/swagger';
import { IsDate, IsIn, IsNotEmpty, IsOptional } from 'class-validator';
import { PaginationQuery } from 'src/pagination/pagination.query';

export class FindAllBorrowingsQuery extends PaginationQuery {
  @ApiProperty({ required: false })
  @IsOptional()
  @IsDate()
  @IsNotEmpty()
  startingDateMin: Date;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsDate()
  @IsNotEmpty()
  startingDateMax: Date;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsIn(['true', 'false'])
  isReturned: string;

  get parsedIsReturned(): boolean | undefined {
    if (this.isReturned === 'true') {
      return true;
    } else if (this.isReturned === 'false') {
      return false;
    }
    return undefined; // Retorna undefined se não for 'true' nem 'false'
  }
}
