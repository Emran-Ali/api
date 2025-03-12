import { Body, Controller, Get, Param, Post, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { GetUser } from '../decorators/get-user.decorator';
import { PermissionGuard } from '../guards/permission.guard';
import { User } from '../interface/user.interface';
import { StreamService } from './stream.service';

@Controller('stream')
// @UseGuards(JwtAuthGuard, PermissionGuard)
export class StreamController {
  constructor(private readonly streamService: StreamService) {}

  @Post('/create-channel/:userId')
  createChannel(@GetUser() user: User, @Param('userId') userId: string) {
    return this.streamService.createDMChannel(userId, `${user.id}`);
  }

  @Post('/send')
  async sendMessage(
    @Body() body: { channelId: string; userId: string; message: string },
  ) {
    return await this.streamService.sendMessage(
      body.channelId,
      body.userId,
      body.message,
    );
  }

  @Get('/messages/:channelId')
  async getMessages(@Param('channelId') channelId: string) {
    return await this.streamService.getMessages(channelId);
  }

  @Get('channel/:userId')
  async getChannel(@Param('userId') userId: string) {
    const channel = await this.streamService.getChannel(userId);
    console.log(channel, 'Channel lIST');
    return await this.streamService.getChannel(userId);
  }
}
