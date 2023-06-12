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
	UseInterceptors,
} from '@nestjs/common';
import { LogInterceptor } from '../interceptors/log-interceptor';
import { CreateUserDto } from './dto/create-user-dto';
import { UpdatePatchUserDto } from './dto/update-patch-user.dto';
import { UpdatePutUserDto } from './dto/update-put-user.dto';
import { UserService } from './user.service';

@Controller('users')
export class UserController {
  constructor(private readonly userService: UserService) {}
  @UseInterceptors(LogInterceptor)
  @Post()
  async create(@Body() { email, name, password, birthAt }: CreateUserDto) {
    return this.userService.create({ email, name, password, birthAt });
  }
  @Get()
  async list() {
    return this.userService.list();
  }
  @Get(':id')
  async show(@Param('id', ParseIntPipe) id: number) {
    return this.userService.show(id);
  }
  @Put(':id')
  async update(
    @Body() { name, password, email, birthAt }: UpdatePutUserDto,
    @Param('id', ParseIntPipe) id: number,
  ) {
    return this.userService.update(id, { name, password, email, birthAt });
  }
  @Patch(':id')
  async updatePartial(
    @Body() { name, password, email, birthAt }: UpdatePatchUserDto,
    @Param('id', ParseIntPipe) id: number,
  ) {
    return this.userService.updatePartial(id, {
      name,
      password,
      email,
      birthAt,
    });
  }
  @Delete(':id')
  async delete(@Param('id', ParseIntPipe) id: number) {
    return this.userService.delete(id);
  }
}
