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
import { CategoriesService } from './categories.service';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';
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
import { FindAllCategoriesQuery } from './query/find-all-categories.query';

@ApiTags('categories')
@ApiBearerAuth()
@ApiBadRequestResponse({ description: 'Bad request.' })
@ApiUnauthorizedResponse({ description: 'Unauthorized.' })
@Controller('categories')
export class CategoriesController {
  constructor(private readonly categoriesService: CategoriesService) {}

  @Post()
  @UseGuards(LibrarianOnlyGuard)
  @ApiForbiddenResponse({ description: 'You must be a librarian.' })
  @ApiCreatedResponse({ description: 'Category sucessfully created.' })
  @Post()
  create(@Body() createCategoryDto: CreateCategoryDto) {
    return this.categoriesService.create(createCategoryDto);
  }

  @Get()
  @ApiOkResponse({ description: 'Categories sucessfully found.' })
  findAll(@Query() query: FindAllCategoriesQuery) {
    return this.categoriesService.findAll(query);
  }

  @Get(':id')
  @ApiOkResponse({ description: 'Category sucessfully found.' })
  findOne(@Param('id', ParseUUIDPipe) id: string) {
    return this.categoriesService.findOneFull(id);
  }

  @Patch(':id')
  @UseGuards(LibrarianOnlyGuard)
  @ApiForbiddenResponse({ description: 'You must be a librarian.' })
  @ApiOkResponse({ description: 'Category sucessfully updated.' })
  update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() updateCategoryDto: UpdateCategoryDto
  ) {
    return this.categoriesService.update(id, updateCategoryDto);
  }

  @Delete(':id')
  @UseGuards(LibrarianOnlyGuard)
  @ApiForbiddenResponse({ description: 'You must be a librarian.' })
  @ApiOkResponse({ description: 'Category sucessfully deleted.' })
  delete(@Param('id', ParseUUIDPipe) id: string) {
    return this.categoriesService.delete(id);
  }
}
