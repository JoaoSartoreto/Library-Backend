import { PartialType } from '@nestjs/swagger';
import { CreateLibraryConfigurationDto } from './create-library-configuration.dto';

export class UpdateLibraryConfigurationDto extends PartialType(
  CreateLibraryConfigurationDto
) {}
