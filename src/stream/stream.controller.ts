import { Controller, Param, Post, UseGuards } from '@nestjs/common';
import { StreamService } from './stream.service';
import { GetUser } from '../decorators/get-user.decorator';
import { User } from '../interface/user.interface';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { PermissionGuard } from '../guards/permission.guard';

@Controller('stream')
@UseGuards(JwtAuthGuard, PermissionGuard)
export class StreamController {
  constructor(private readonly streamService: StreamService) {}
  @Post('/create-channel')
  createChannel(@GetUser() user: User) {
    return this.streamService.createChannel('newchannelid', `${user.id}`);
  }
  @Post('send/:userId')
  sendMessage(@Param('userId') userId: string) {
    return this.streamService.sendMessage(
      'newchannelid',
      userId,
      'Hello test Massage',
    );
  }
}
