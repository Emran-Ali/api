import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UserModule } from './user/user.module';
import { PrismaModule } from './prisma/prisma.module';
import { AuthModule } from './auth/auth.module';
import { StreamModule } from './stream/stream.module';
import { ConfigsModule } from './configs/configs.module';

@Module({
  imports: [UserModule, PrismaModule, AuthModule, ConfigsModule, StreamModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
