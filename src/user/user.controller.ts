import {
	Body,
	Controller,
	Delete,
	Get,
	Param,
	Patch,
	Post,
	Put,
} from '@nestjs/common';
import { CreateUserDto } from './dto/create-user-dto';
import { UpdatePatchUserDto } from './dto/update-patch-user.dto';
import { UpdatePutUserDto } from './dto/update-put-user.dto';

@Controller('users')
export class UserController {
  @Post()
  async create(@Body() { email, name, password }: CreateUserDto) {
    return { email, name, password };
  }
  @Get()
  async list() {
    return { users: [] };
  }
  @Get(':id')
  async show(@Param() params) {
    return { user: {}, params };
  }
  @Put(':id')
  async update(
    @Body() { name, password, email }: UpdatePutUserDto,
    @Param() params,
  ) {
    return {
      name,
      password,
      email,
      params,
    };
  }
  @Patch(':id')
  async updatePartial(
    @Body() { name, password, email }: UpdatePatchUserDto,
    @Param() params,
  ) {
    return {
      name,
      password,
      email,
      params,
    };
  }
  @Delete(':id')
  async delete(@Param() params) {
    return {
      params,
    };
  }
}
