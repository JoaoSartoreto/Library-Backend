import { PickType } from '@nestjs/swagger';
import { CreateReserveDto } from './create-reserve.dto';

export class UpdateReserveDto extends PickType(CreateReserveDto, [
  'startDate',
  'endDate'
]) {}
