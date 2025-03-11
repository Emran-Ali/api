import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class ConfigsService {
  readonly streamApiKey: string;
  readonly streamApiSecret: string;

  constructor(private readonly configService: ConfigService) {
    this.streamApiKey = this.getFromEnv<string>('STREAM_API_KEY');
    this.streamApiSecret = this.getFromEnv<string>('STREAM_API_SECRET');
  }

  private getFromEnv<T>(key: string): T {
    const value = this.configService.get<T>(key);
    if (!value) {
      throw new Error(`No ${key} in environment variables`);
    }
    return value;
  }
}
