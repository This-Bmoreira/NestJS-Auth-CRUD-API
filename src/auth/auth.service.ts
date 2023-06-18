import { MailerService } from '@nestjs-modules/mailer';
import {
  BadRequestException,
  HttpStatus,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { User } from '@prisma/client';
import * as bcrypt from 'bcrypt';
import { PrismaService } from '../prisma/prisma.service';
import { UserService } from '../user/user.service';
import { AuthRegisterDTO } from './dto/auth-register.dto';

@Injectable()
export class AuthService {
  private issuer = 'login';
  private audience = 'users';

  constructor(
    private readonly jwtService: JwtService,
    private readonly prisma: PrismaService,
    private readonly userService: UserService,
    private readonly mailer: MailerService,
  ) { }
  createToken(user: User) {
    return {
      accessToken: this.jwtService.sign(
        {
          id: user.id,
          name: user.name,
          email: user.email,
        },
        {
          expiresIn: '150 days',
          subject: String(user.id),
          issuer: this.issuer,
          audience: this.audience,
        },
      ),
    };
  }
  checkToken(token: string) {
    try {
      const data = this.jwtService.verify(token, {
        issuer: this.issuer,
        audience: this.audience,
      });
      return data;
    } catch (e) {
      throw new BadRequestException(HttpStatus.FORBIDDEN);
    }
  }
  isValidToken(token: string) {
    try {
      this.checkToken(token);
      return true;
    } catch (e) {
      return false;
    }
  }
  async login(email: string, password: string) {
    const user = await this.prisma.user.findFirst({
      where: {
        email,
      },
    });
    if (!user) {
      throw new UnauthorizedException('E-mail e/ou senha incorretos');
    }
    if (!(await bcrypt.compare(password, user.password))) {
      throw new UnauthorizedException('E-mail e/ou senha incorretos');
    }
    return this.createToken(user);
  }
  async forget(email: string) {
    const user = await this.prisma.user.findFirst({
      where: {
        email,
      },
    });
    if (!user) {
      throw new UnauthorizedException('E-mail senha incorreto');
    }
    const token = this.jwtService.sign({
      id: user.id
    }, {
      expiresIn: "30 minutes",
      subject: String(user.id),
      issuer: 'forget',
      audience: 'users',
    })
    await this.mailer.sendMail({
      subject: 'Recuperação de senha',
      to: 'b@gmail.com',
      template: 'forget',
      context: {
        name: user.name,
        token
      }
    });
    return true;
  }
  async reset(password: string, token: string) {
  

    try {
      const data = this.jwtService.verify(token, {
        issuer: 'forget',
        audience: 'users',
      });

      if (isNaN(Number(data.id))) {
        throw new BadRequestException("token é inválido");
      }
      const salt = await bcrypt.genSalt()
      password = await bcrypt.hash(password, salt)
      const user = await this.prisma.user.update({
        where: {
          id: Number(data.id),
        },
        data: {
          password,
        },
      });
      return this.createToken(user)
    } catch (e) {
      throw new BadRequestException(HttpStatus.FORBIDDEN);
    }

  }
  async register(data: AuthRegisterDTO) {
    const user = await this.userService.create(data);
    return this.createToken(user);
  }
}
