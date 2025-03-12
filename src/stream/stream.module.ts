import { Module } from '@nestjs/common';
import { StreamAuthService } from './stream-auth.service';
import { StreamController } from './stream.controller';
import { StreamService } from './stream.service';

@Module({
  controllers: [StreamController],
  providers: [StreamService, StreamAuthService],
})
export class StreamModule {}
