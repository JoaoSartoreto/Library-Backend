import {
  Controller,
  Get,
  Patch,
  Param,
  UseGuards,
  Query,
  ParseUUIDPipe,
  Req
} from '@nestjs/common';
import { FinesService } from './fines.service';
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
import { FindAllFinesQuery } from './query/find-all-fines.query';
import { User } from 'src/users/entities/user.entity';

@ApiTags('fines')
@ApiBearerAuth()
@ApiBadRequestResponse({ description: 'Bad request.' })
@ApiUnauthorizedResponse({ description: 'Unauthorized.' })
@Controller('fines')
export class FinesController {
  constructor(private readonly finesService: FinesService) {}

  @Patch('pay/:id')
  @UseGuards(LibrarianOnlyGuard)
  @ApiForbiddenResponse({ description: 'You must be a librarian.' })
  @ApiCreatedResponse({ description: 'Fine sucessfully created.' })
  payFine(@Param('id', ParseUUIDPipe) id: string) {
    return this.finesService.payFine(id);
  }

  @Get()
  @ApiOkResponse({ description: 'Fine sucessfully found.' })
  findAll(@Query() query: FindAllFinesQuery, @Req() request: { user: User }) {
    const { user } = request;
    return this.finesService.findAll(query, user);
  }

  @Get(':id')
  @ApiOkResponse({ description: 'Fine sucessfully found.' })
  findOne(
    @Param('id', ParseUUIDPipe) id: string,
    @Req() request: { user: User }
  ) {
    const { user } = request;
    return this.finesService.findOneFull(id, user);
  }
}
