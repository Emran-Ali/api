import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { StreamChat } from 'stream-chat';
import { User } from '../interface/user.interface';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class StreamService {
  private chatClient: StreamChat;
  constructor(private readonly config: ConfigService) {
    const apiKey = this.config.get<string>('STREAM_API_KEY') || '';
    const apiSecret = this.config.get<string>('STREAM_API_SECRET') || '';

    this.chatClient = new StreamChat(apiKey, apiSecret);
  }

  async createUserToken(user: User): Promise<string> {
    try {
      await this.chatClient.upsertUsers([
        {
          id: `${user.id}`,
          role: 'admin',
          imageUrl: '/default-avatar.png',
          name: user.name,
        },
      ]);
      return this.chatClient.createToken(`${user.id}`);
    } catch (error) {
      console.log(error);
      throw new InternalServerErrorException('cant create user token');
    }
  }

  async revokeUserToken(userId: string) {
    return await this.chatClient.revokeTokens(userId);
  }

  async createChannel(channelId: string, creatorId: string) {
    return await this.chatClient
      .channel('messaging', channelId, {
        created_by_id: creatorId,
      })
      .create();
  }

  async sendMessage(channelId: string, userId: string, message: string) {
    const channel = this.chatClient.channel('messaging', channelId);
    return channel.sendMessage({ text: message, user_id: userId });
  }
}
