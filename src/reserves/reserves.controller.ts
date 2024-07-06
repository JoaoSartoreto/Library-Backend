import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
  ParseUUIDPipe,
  Req
} from '@nestjs/common';
import { ReservesService } from './reserves.service';
import { UpdateReserveDto } from './dto/update-reserve.dto';
import {
  ApiBadRequestResponse,
  ApiBearerAuth,
  ApiCreatedResponse,
  ApiForbiddenResponse,
  ApiOkResponse,
  ApiTags,
  ApiUnauthorizedResponse
} from '@nestjs/swagger';
import { FindAllReservesQuery } from './query/find-all-reserves.query';
import { CreateReserveDto } from './dto/create-reserve.dto';
import { User } from 'src/users/entities/user.entity';

@ApiTags('reserves')
@ApiBearerAuth()
@ApiBadRequestResponse({ description: 'Bad request.' })
@ApiUnauthorizedResponse({ description: 'Unauthorized.' })
@Controller('reserves')
export class ReservesController {
  constructor(private readonly reservesService: ReservesService) {}

  @Post()
  @ApiCreatedResponse({ description: 'Reserve sucessfully created.' })
  create(
    @Body() createReserveDto: CreateReserveDto,
    @Req() request: { user: User }
  ) {
    const { user } = request;
    return this.reservesService.create(user.id, createReserveDto);
  }

  @Get()
  @ApiOkResponse({ description: 'Reserves sucessfully found.' })
  findAll(
    @Query() query: FindAllReservesQuery,
    @Req() request: { user: User }
  ) {
    const { user } = request;
    return this.reservesService.findAll(query, user);
  }

  @Get(':id')
  @ApiForbiddenResponse({
    description: 'You must be a librarian or owner of the reserve'
  })
  @ApiOkResponse({ description: 'Reserve sucessfully found.' })
  findOne(
    @Param('id', ParseUUIDPipe) id: string,
    @Req() request: { user: User }
  ) {
    const { user } = request;
    return this.reservesService.findOneAuth(id, user);
  }

  @Patch(':id')
  @ApiForbiddenResponse({ description: 'You must be a librarian.' })
  @ApiOkResponse({ description: 'Reserve sucessfully updated.' })
  update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() updateReserveDto: UpdateReserveDto,
    @Req() request: { user: User }
  ) {
    const { user } = request;
    return this.reservesService.update(id, updateReserveDto, user);
  }

  @Delete(':id')
  @ApiForbiddenResponse({ description: 'You must be a librarian.' })
  @ApiOkResponse({ description: 'Reserve sucessfully deleted.' })
  delete(
    @Param('id', ParseUUIDPipe) id: string,
    @Req() request: { user: User }
  ) {
    const { user } = request;
    return this.reservesService.delete(id, user);
  }
}
