import { Global, Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { ConfigsService } from './configs.service';

@Global()
@Module({
  imports: [ConfigModule.forRoot({ cache: true })],
  providers: [ConfigsService],
  exports: [ConfigsService],
})
export class ConfigsModule {}
