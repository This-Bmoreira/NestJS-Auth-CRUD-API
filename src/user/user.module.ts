import {
	MiddlewareConsumer,
	Module,
	NestModule,
	RequestMethod,
	forwardRef,
} from '@nestjs/common';
import { AuthModule } from '../auth/auth.module';
import { UserIdCheckMiddleware } from '../middleware/user-id-check.middleware';
import { PrismaModule } from '../prisma/prisma.module';
import { PrismaService } from '../prisma/prisma.service';
import { UserController } from './user.controller';
import { UserService } from './user.service';

@Module({
  imports: [PrismaModule, forwardRef(() => AuthModule)],
  controllers: [UserController],
  providers: [UserService, PrismaService],
  exports: [UserService],
})
export class UserModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(UserIdCheckMiddleware).forRoutes({
      path: 'users/:id',
      method: RequestMethod.ALL,
    });
  }
}
