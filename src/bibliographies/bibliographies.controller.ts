import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  Query,
  ParseUUIDPipe
} from '@nestjs/common';
import { BibliographiesService } from './bibliographies.service';
import { CreateBibliographyDto } from './dto/create-bibliography.dto';
import { UpdateBibliographyDto } from './dto/update-bibliography.dto';
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
import { FindAllBibliographiesQuery } from './query/find-all-bibliographies.query';

@ApiTags('bibliographys')
@ApiBearerAuth()
@ApiBadRequestResponse({ description: 'Bad request.' })
@ApiUnauthorizedResponse({ description: 'Unauthorized.' })
@Controller('bibliographys')
export class BibliographiesController {
  constructor(private readonly bibliographiesService: BibliographiesService) {}

  @Post()
  @UseGuards(LibrarianOnlyGuard)
  @ApiForbiddenResponse({ description: 'You must be a librarian.' })
  @ApiCreatedResponse({ description: 'Bibliography sucessfully created.' })
  create(@Body() createBibliographyDto: CreateBibliographyDto) {
    return this.bibliographiesService.create(createBibliographyDto);
  }

  @Get()
  @ApiOkResponse({ description: 'Bibliographies sucessfully found.' })
  findAll(@Query() query: FindAllBibliographiesQuery) {
    return this.bibliographiesService.findAll(query);
  }

  @Get(':id')
  @ApiOkResponse({ description: 'Bibliography sucessfully found.' })
  findOne(@Param('id', ParseUUIDPipe) id: string) {
    return this.bibliographiesService.findOneFull(id);
  }

  @Patch(':id')
  @UseGuards(LibrarianOnlyGuard)
  @ApiForbiddenResponse({ description: 'You must be a librarian.' })
  @ApiOkResponse({ description: 'Bibliography sucessfully updated.' })
  update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() updateBibliographyDto: UpdateBibliographyDto
  ) {
    return this.bibliographiesService.update(id, updateBibliographyDto);
  }

  @Delete(':id')
  @UseGuards(LibrarianOnlyGuard)
  @ApiForbiddenResponse({ description: 'You must be a librarian.' })
  @ApiOkResponse({ description: 'Bibliography sucessfully deleted.' })
  delete(@Param('id', ParseUUIDPipe) id: string) {
    return this.bibliographiesService.delete(id);
  }
}
