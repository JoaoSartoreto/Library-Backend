import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  UseGuards,
  Query,
  ParseUUIDPipe,
  Req
} from '@nestjs/common';
import { BorrowingsService } from './borrowings.service';
import { CreateBorrowingDto } from './dto/create-borrowing.dto';
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
import { FindAllBorrowingsQuery } from './query/find-all-borrowings.query';
import { User } from 'src/users/entities/user.entity';

@ApiTags('borrowings')
@ApiBearerAuth()
@ApiBadRequestResponse({ description: 'Bad request.' })
@ApiUnauthorizedResponse({ description: 'Unauthorized.' })
@Controller('borrowings')
export class BorrowingsController {
  constructor(private readonly borrowingsService: BorrowingsService) {}

  @Post()
  @UseGuards(LibrarianOnlyGuard)
  @ApiForbiddenResponse({ description: 'You must be a librarian.' })
  @ApiCreatedResponse({ description: 'Borrowing sucessfully created.' })
  create(@Body() createBorrowingDto: CreateBorrowingDto) {
    return this.borrowingsService.create(createBorrowingDto);
  }

  @Get()
  @ApiOkResponse({ description: 'Borrowing sucessfully found.' })
  findAll(
    @Query() query: FindAllBorrowingsQuery,
    @Req() request: { user: User }
  ) {
    const { user } = request;
    return this.borrowingsService.findAll(query, user);
  }

  @Get(':id')
  @ApiOkResponse({ description: 'Borrowing sucessfully found.' })
  findOne(
    @Param('id', ParseUUIDPipe) id: string,
    @Req() request: { user: User }
  ) {
    const { user } = request;
    return this.borrowingsService.findOneAuth(id, user);
  }

  @Patch('return/:id')
  @UseGuards(LibrarianOnlyGuard)
  @ApiForbiddenResponse({ description: 'You must be a librarian.' })
  @ApiOkResponse({ description: 'Borrowing sucessfully updated.' })
  update(@Param('id', ParseUUIDPipe) id: string) {
    return this.borrowingsService.returnBorrowing(id);
  }
}
