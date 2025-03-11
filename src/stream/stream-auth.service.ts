import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { StreamChat } from 'stream-chat';
import { ConfigsService } from '../configs/configs.service';
import { User } from '../interface/user.interface';

@Injectable()
export class StreamAuthService {
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
}
