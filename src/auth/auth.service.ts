import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { User } from '../interface/user.interface';
import { PrismaService } from '../prisma/prisma.service';
import { StreamAuthService } from '../stream/stream-auth.service';

@Injectable()
export class AuthService {
  constructor(
    private prisma: PrismaService,
    private jwtService: JwtService,
    private streamAuthService: StreamAuthService,
  ) {}

  async loginUser(credential: { email: string; password: string }) {
    const user = await this.validateUser(credential.email, credential.password);
    try {
      return {
        token: this.jwtService.sign(user),
        streamToken: await this.streamAuthService.createUserToken(user),
        user: user,
      };
    } catch (error) {
      console.log(error);
      throw new InternalServerErrorException('cant validate user credentials');
    }
  }

  private async validateUser(email: string, password: string): Promise<User> {
    try {
      const user = await this.prisma.user.findFirstOrThrow({
        where: { email: email },
        include: {
          UserHasRole: {
            select: {
              role: true,
            },
          },
        },
      });
      if (user) {
        const isValidPassword = await bcrypt.compare(password, user.password);
        if (isValidPassword) {
          const roles = user.UserHasRole.map((role) => role.role);

          const { id, email, name, photo, ...result } = user;
          return {
            id,
            email,
            name,
            photo,
            roles,
          };
        }
      }
      return user;
    } catch (error) {
      console.log(error);
      throw new InternalServerErrorException('Unauthorized');
    }
  }

  logoutUser(token: string) {
    return this.streamAuthService.revokeUserToken(token);
  }
}
