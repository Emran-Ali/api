import { Injectable, InternalServerErrorException, Req } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { PrismaService } from '../prisma/prisma.service';
import { JwtService } from '@nestjs/jwt';
import { User } from '../interface/user.interface';
import { StreamService } from '../stream/stream.service';

@Injectable()
export class AuthService {
  constructor(
    private prisma: PrismaService,
    private jwtService: JwtService,
    private streamService: StreamService,
  ) {}

  async loginUser(credential: { email: string; password: string }) {
    const user = await this.validateUser(credential.email, credential.password);
    try {
      return {
        access_token: this.jwtService.sign(user),
        chatUserToken: await this.streamService.createUserToken(user),
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
          UserHasPermission: {
            select: {
              permission: true,
            },
          },
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
          const permissions = user.UserHasPermission.map(
            (permission) => permission.permission,
          );
          const { id, email, name, ...result } = user;
          return {
            id,
            email,
            name,
            roles,
            permissions,
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
    return this.streamService.revokeUserToken(token);
  }
}
