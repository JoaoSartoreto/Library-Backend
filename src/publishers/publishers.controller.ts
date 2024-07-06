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
import { PublishersService } from './publishers.service';
import { CreatePublisherDto } from './dto/create-publisher.dto';
import { UpdatePublisherDto } from './dto/update-publisher.dto';
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
import { FindAllPublishersQuery } from './query/find-all-publisher.query';

@ApiTags('publishers')
@ApiBearerAuth()
@ApiBadRequestResponse({ description: 'Bad request.' })
@ApiUnauthorizedResponse({ description: 'Unauthorized.' })
@Controller('publishers')
export class PublishersController {
  constructor(private readonly publishersService: PublishersService) {}

  @Post()
  @UseGuards(LibrarianOnlyGuard)
  @ApiForbiddenResponse({ description: 'You must be a librarian.' })
  @ApiCreatedResponse({ description: 'Publisher sucessfully created.' })
  create(@Body() createPublisherDto: CreatePublisherDto) {
    return this.publishersService.create(createPublisherDto);
  }

  @Get()
  @ApiOkResponse({ description: 'Publishers sucessfully found.' })
  findAll(@Query() query: FindAllPublishersQuery) {
    return this.publishersService.findAll(query);
  }

  @Get(':id')
  @ApiOkResponse({ description: 'Publisher sucessfully found.' })
  findOne(@Param('id', ParseUUIDPipe) id: string) {
    return this.publishersService.findOneFull(id);
  }

  @Patch(':id')
  @UseGuards(LibrarianOnlyGuard)
  @ApiForbiddenResponse({ description: 'You must be a librarian.' })
  @ApiOkResponse({ description: 'Publisher sucessfully updated.' })
  update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() updatePublisherDto: UpdatePublisherDto
  ) {
    return this.publishersService.update(id, updatePublisherDto);
  }

  @Delete(':id')
  @UseGuards(LibrarianOnlyGuard)
  @ApiForbiddenResponse({ description: 'You must be a librarian.' })
  @ApiOkResponse({ description: 'Publisher sucessfully deleted.' })
  delete(@Param('id', ParseUUIDPipe) id: string) {
    return this.publishersService.delete(id);
  }
}
