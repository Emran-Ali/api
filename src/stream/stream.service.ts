import { Injectable } from '@nestjs/common';
import { ConfigsService } from 'src/configs/configs.service';
import { StreamChat } from 'stream-chat';

@Injectable()
export class StreamService {
  private chatClient: StreamChat;

  constructor(private readonly configsService: ConfigsService) {
    const apiKey = this.configsService.streamApiKey;
    const apiSecret = this.configsService.streamApiSecret;
    this.chatClient = new StreamChat(apiKey, apiSecret);
  }

  // Create a direct one-to-one messaging channel
  async createDMChannel(userId1: string, userId2: string) {
    const channel = this.chatClient.channel('messaging', {
      members: [userId1, userId2],
    });

    return await channel.create();
  }

  async getChannel(userId: string) {
    const filter = { type: 'messaging', members: { $in: [userId] } };
    return await this.chatClient.queryChannels(
      filter,
      [{ last_message_at: -1 }, { last_updated: -1 }],
      {
        watch: false, // this is the default
        state: true,
      },
    );
  }

  // Send a message in a direct chat channel
  async sendMessage(channelId: string, userId: string, message: string) {
    const channel = this.chatClient.channel('messaging', channelId);
    return await channel.sendMessage({ text: message, user_id: userId });
  }

  // Fetch messages from a channel
  async getMessages(channelId: string) {
    const channel = this.chatClient.channel('messaging', channelId);
    return await channel.query({ messages: { limit: 20 } });
  }
}
