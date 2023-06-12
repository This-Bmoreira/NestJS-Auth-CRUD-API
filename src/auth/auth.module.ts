import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';

@Module({
  imports: [
    JwtModule.register({
      secret: 'kdjfjkkeo,mvikkdkfmkw5738*&¨@*#(ikjfcki94)@#$ççcp~4395u323',
    }),
  ],
})
export class AuthModule {}
