import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { StreamService } from '../stream/stream-auth.service';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { jwtConstants } from './constants';
import { JwtStrategy } from './jwt.strategy';

@Module({
  imports: [
    PassportModule,
    JwtModule.register({
      secret: jwtConstants.secret,
      signOptions: { expiresIn: '12h' },
    }),
  ],
  providers: [AuthService, JwtStrategy, StreamService],
  controllers: [AuthController],
  exports: [AuthService],
})
export class AuthModule {}
