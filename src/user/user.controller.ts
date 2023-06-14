import {
	Body,
	Controller,
	Delete,
	Get,
	Patch,
	Post,
	Put,
	UseGuards,
	UseInterceptors,
} from '@nestjs/common';
import { ParamId } from '../decorators/param-id.decorator';
import { Roles } from '../decorators/roles.decorators';
import { Role } from '../enums/role.enum';
import { AuthGuard } from '../guards/auth.guard';
import { RoleGuard } from '../guards/role.guard';
import { LogInterceptor } from '../interceptors/log-interceptor';
import { CreateUserDto } from './dto/create-user-dto';
import { UpdatePatchUserDto } from './dto/update-patch-user.dto';
import { UpdatePutUserDto } from './dto/update-put-user.dto';
import { UserService } from './user.service';
@Roles(Role.Admin)
@UseGuards(AuthGuard, RoleGuard)
@Controller('users')
export class UserController {
  constructor(private readonly userService: UserService) {}
  @UseInterceptors(LogInterceptor)

  @Post()
  async create(
    @Body() { email, name, password, birthAt, role }: CreateUserDto,
  ) {
    return this.userService.create({ email, name, password, birthAt, role });
  }

  @Get()
  async list() {
    return this.userService.list();
  }

  @Get(':id')
  async show(@ParamId() id: number) {
    console.log({ id });
    return this.userService.show(id);
  }

  @Put(':id')
  async update(
    @Body() { name, password, email, birthAt, role }: UpdatePutUserDto,
    @ParamId() id: number,
  ) {
    return this.userService.update(id, {
      name,
      password,
      email,
      birthAt,
      role,
    });
  }

  @Patch(':id')
  async updatePartial(
    @Body() { name, password, email, birthAt }: UpdatePatchUserDto,
    @ParamId() id: number,
  ) {
    return this.userService.updatePartial(id, {
      name,
      password,
      email,
      birthAt,
    });
  }

  @Delete(':id')
  async delete(@ParamId() id: number) {
    return this.userService.delete(id);
  }
}
