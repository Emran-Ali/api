import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { StreamChat } from 'stream-chat';
import { User } from '../interface/user.interface';
import { ConfigsService } from '../configs/configs.service';

@Injectable()
export class StreamService {
  private chatClient: StreamChat;
  constructor(private readonly configsService: ConfigsService) {
    const apiKey = this.configsService.streamApiKey;
    const apiSecret = this.configsService.streamApiSecret;
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
