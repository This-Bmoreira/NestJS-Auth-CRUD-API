import { BadRequestException, Body, Controller, Post, UploadedFile, UseGuards, UseInterceptors } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { join } from 'path';
import { User } from '../decorators/user.decorator';
import { FileService } from '../file/file.service';
import { AuthGuard } from '../guards/auth.guard';
import { UserService } from '../user/user.service';
import { AuthService } from './auth.service';
import { AuthForgetDTO } from './dto/auth-forget.dto';
import { AuthLoginDTO } from './dto/auth-login.dto';
import { AuthRegisterDTO } from './dto/auth-register.dto';
import { AuthResetDto } from './dto/auth-reset.dto';

@Controller('auth')
export class AuthController {
  constructor(
    private readonly userService: UserService,
    private readonly authService: AuthService,
    private readonly fileService: FileService
  ) { }
  @Post('login')
  async login(@Body() { email, password }: AuthLoginDTO) {
    return this.authService.login(email, password);
  }

  @Post('register')
  async register(@Body() body: AuthRegisterDTO) {
    return this.authService.register(body);
  }

  @Post('forget')
  async forget(@Body() { email }: AuthForgetDTO) {
    return this.authService.forget(email);
  }

  @Post('reset')
  async reset(@Body() { password, token }: AuthResetDto) {
    return this.authService.reset(password, token);
  }
  @UseGuards(AuthGuard)
  @Post('me')
  async me(@User() user) {
    return { user };
  }
  @UseInterceptors(FileInterceptor('file'))
  @UseGuards(AuthGuard)
  @Post('photo')
  async uploadPhoto(@User() user, @UploadedFile() photo: Express.Multer.File) {

    const path = join(__dirname, '..', '..', 'storage', 'photo', `photo-${user.id}`)

    try {
      await this.fileService.upload(photo, path)
    } catch (e) {
      throw new BadRequestException(e)
    }
    return { success: true }
  }
}
