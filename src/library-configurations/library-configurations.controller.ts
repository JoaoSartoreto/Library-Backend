import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  ParseUUIDPipe,
  UseGuards,
  Query
} from '@nestjs/common';
import { LibraryConfigurationsService } from './library-configurations.service';
import { CreateLibraryConfigurationDto } from './dto/create-library-configuration.dto';
import { UpdateLibraryConfigurationDto } from './dto/update-library-configuration.dto';
import {
  ApiBadRequestResponse,
  ApiBearerAuth,
  ApiCreatedResponse,
  ApiForbiddenResponse,
  ApiOkResponse,
  ApiTags,
  ApiUnauthorizedResponse
} from '@nestjs/swagger';
import { LibrarianOnlyGuard } from 'src/auth/librarian-only.guard';
import { FindAllLibraryConfigurationsQuery } from './query/find-all-library-configurations.query';

@ApiTags('library-configurations')
@ApiBearerAuth()
@ApiBadRequestResponse({ description: 'Bad request.' })
@ApiUnauthorizedResponse({ description: 'Unauthorized.' })
@ApiForbiddenResponse({ description: 'You must be a librarian.' })
@UseGuards(LibrarianOnlyGuard)
@Controller('library-configurations')
export class LibraryConfigurationsController {
  constructor(
    private readonly libraryConfigurationsService: LibraryConfigurationsService
  ) {}

  @Post()
  @ApiCreatedResponse({ description: 'Configuration sucessfully created.' })
  create(@Body() createLibraryConfigurationDto: CreateLibraryConfigurationDto) {
    return this.libraryConfigurationsService.create(
      createLibraryConfigurationDto
    );
  }

  @Get()
  @ApiOkResponse({ description: 'Configurations sucessfully found.' })
  findAll(@Query() query: FindAllLibraryConfigurationsQuery) {
    return this.libraryConfigurationsService.findAll(query);
  }

  @Get(':id')
  @ApiOkResponse({ description: 'Configuration sucessfully found.' })
  findOne(@Param('id', ParseUUIDPipe) id: string) {
    return this.libraryConfigurationsService.findOne(id);
  }

  @Patch(':id')
  @ApiOkResponse({ description: 'Configurations sucessfully updated.' })
  update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() updateLibraryConfigurationDto: UpdateLibraryConfigurationDto
  ) {
    return this.libraryConfigurationsService.update(
      id,
      updateLibraryConfigurationDto
    );
  }

  @Delete(':id')
  @ApiOkResponse({ description: 'Configurations sucessfully deleted.' })
  delete(@Param('id', ParseUUIDPipe) id: string) {
    console.log('delete');
    return this.libraryConfigurationsService.delete(id);
  }
}
