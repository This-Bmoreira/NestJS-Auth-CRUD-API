import { Module } from '@nestjs/common';
import { PrismaService } from './prisma.service';

@Module({
  providers: [PrismaModule],
  exports: [PrismaService],
})
export class PrismaModule {}
