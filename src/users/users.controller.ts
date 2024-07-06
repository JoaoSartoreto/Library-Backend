import {
  Controller,
  Post,
  Body,
  Patch,
  Req,
  Param,
  ForbiddenException,
  ParseUUIDPipe,
  Delete
} from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import {
  ApiBadRequestResponse,
  ApiBearerAuth,
  ApiCreatedResponse,
  ApiForbiddenResponse,
  ApiOkResponse,
  ApiTags,
  ApiUnauthorizedResponse
} from '@nestjs/swagger';
import { Public } from 'src/auth/public.decorator';
import { UpdateUserDto } from './dto/update-user.dto';

@ApiTags('users')
@ApiBadRequestResponse({ description: 'Bad request.' })
@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Public()
  @Post()
  @ApiCreatedResponse({ description: 'User sucessfully created.' })
  create(@Body() createUserDto: CreateUserDto) {
    return this.usersService.create(createUserDto);
  }

  @Patch(':id')
  @ApiBearerAuth()
  @ApiOkResponse({ description: 'User sucessfully updated.' })
  @ApiUnauthorizedResponse({ description: 'Unauthorized.' })
  @ApiForbiddenResponse({
    description: "You don't have permission to update this user."
  })
  update(
    @Body() updateUserDto: UpdateUserDto,
    @Param('id', ParseUUIDPipe) id: string,
    @Req() request: any
  ) {
    if (id !== request.user.id) {
      throw new ForbiddenException(
        "you don't have permission to update this user"
      );
    }

    return this.usersService.update(id, updateUserDto);
  }

  @Delete(':id')
  @ApiBearerAuth()
  @ApiOkResponse({ description: 'User sucessfully deleted.' })
  @ApiUnauthorizedResponse({ description: 'Unauthorized.' })
  @ApiForbiddenResponse({
    description: "You don't have permission to delete this user."
  })
  delete(@Param('id', ParseUUIDPipe) id: string, @Req() request: any) {
    if (id !== request.user.id) {
      throw new ForbiddenException(
        "you don't have permission to delete this user"
      );
    }

    return this.usersService.delete(id);
  }
}
