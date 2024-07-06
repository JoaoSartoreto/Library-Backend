import { PartialType } from '@nestjs/swagger';
import { CreateBibliographyDto } from './create-bibliography.dto';

export class UpdateBibliographyDto extends PartialType(CreateBibliographyDto) {}
