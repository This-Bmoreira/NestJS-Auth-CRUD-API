import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  Put,
} from '@nestjs/common';
import { CreateUserDto } from './dto/create-user-dto';
import { UpdatePatchUserDto } from './dto/update-patch-user.dto';
import { UpdatePutUserDto } from './dto/update-put-user.dto';
import { UserService } from './user.service';

@Controller('users')
export class UserController {
  constructor(private readonly userService: UserService) {}
  @Post()
  async create(@Body() { email, name, password }: CreateUserDto) {
    return this.userService.create({ email, name, password });
  }
  @Get()
  async list() {
    return { users: [] };
  }
  @Get(':id')
  async show(@Param('id', ParseIntPipe) id: number) {
    return { user: {}, id };
  }
  @Put(':id')
  async update(
    @Body() { name, password, email }: UpdatePutUserDto,
    @Param('id', ParseIntPipe) id: number,
  ) {
    return {
      name,
      password,
      email,
      id,
    };
  }
  @Patch(':id')
  async updatePartial(
    @Body() { name, password, email }: UpdatePatchUserDto,
    @Param('id', ParseIntPipe) id: number,
  ) {
    return {
      name,
      password,
      email,
      id,
    };
  }
  @Delete(':id')
  async delete(@Param('id', ParseIntPipe) id: number) {
    return {
      id,
    };
  }
}
