import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { PrismaService } from '../prisma/prisma.service';
import { Prisma } from '@prisma/client';
import * as bcrypt from 'bcrypt';
import { RolePermissionDto } from './dto/role-permission.dto';

@Injectable()
export class UserService {
  constructor(private prisma: PrismaService) {}

  async create(createUserDto: CreateUserDto) {
    try {
      createUserDto.password = await bcrypt.hash(createUserDto.password, 10);
      return await this.prisma.user.create({
        data: {
          email: createUserDto.email,
          name: createUserDto.name,
          password: createUserDto.password,
          UserHasRole: {
            create: [
              {
                role: 'USER',
              },
            ],
          },
        },
        select: {
          id: true,
          email: true,
          name: true,
          photo: true,
        },
      });
    } catch (error) {
      if (error instanceof Prisma.PrismaClientKnownRequestError) {
        if (error.code === 'P2002' && error.meta && error.meta.target) {
          const target = error.meta?.target;
          const fields = Array.isArray(target) ? target.join(', ') : 'field(s)';
          throw new HttpException(
            `A user with the same ${fields} already exists.`,
            HttpStatus.CONFLICT,
          );
        }
      }
      throw new HttpException(
        {
          status: HttpStatus.INTERNAL_SERVER_ERROR,
          error: error?.message,
        },
        HttpStatus.INTERNAL_SERVER_ERROR,
        {
          cause: error,
        },
      );
    }
  }

  async findAll(params: {
    skip?: number;
    take?: number;
    cursor?: Prisma.UserWhereUniqueInput;
    where?: Prisma.UserWhereInput;
    orderBy?: Prisma.UserOrderByWithRelationInput;
  }) {
    const { skip, take, cursor, where, orderBy } = params;
    return this.prisma.user.findMany({
      skip,
      take,
      cursor,
      where,
      orderBy,
      select: {
        id: true,
        name: true,
        email: true,
      },
    });
  }

  async findOne(id: string) {
    return this.prisma.user.findFirst({
      where: { id: id },
      select: {
        id: true,
        name: true,
        email: true,
      },
    });
  }

  async update(id: string, updateUserDto: UpdateUserDto) {
    try {
      return this.prisma.user.update({
        data: updateUserDto,
        where: { id: id },
        select: {
          id: true,
          email: true,
          name: true,
        },
      });
    } catch (error) {
      if (error instanceof Prisma.PrismaClientKnownRequestError) {
        if (error.code === 'P2002' && error.meta && error.meta.target) {
          const target = error.meta?.target;
          const fields = Array.isArray(target) ? target.join(', ') : 'field(s)';
          throw new HttpException(
            `A user with the same ${fields} already exists.`,
            HttpStatus.CONFLICT,
          );
        }
      }
      throw new HttpException(
        {
          status: HttpStatus.INTERNAL_SERVER_ERROR,
          error: error?.message,
        },
        HttpStatus.INTERNAL_SERVER_ERROR,
        {
          cause: error,
        },
      );
    }
  }

  async remove(id: string) {
    try {
      const user = await this.prisma.user.findFirst({ where: { id: id } });
      if (!user) {
        throw new HttpException('User does not exists.', HttpStatus.CONFLICT);
      }
      await this.prisma.user.delete({ where: { id: id } });
      return { message: 'User successfully deleted.' };
    } catch (error) {
      throw new HttpException(
        {
          status: HttpStatus.INTERNAL_SERVER_ERROR,
          error: error.message,
        },
        HttpStatus.INTERNAL_SERVER_ERROR,
        {
          cause: error,
        },
      );
    }
  }

  async syncRolePermission(id: string, rolePermission: RolePermissionDto) {
    try {
      const user = await this.prisma.user.findFirst({ where: { id: id } });
      if (!user) {
        throw new HttpException('User does not exists.', HttpStatus.NOT_FOUND);
      }
      const roles = rolePermission?.roles?.map((role) => {
        return { role: role, userId: id };
      });
      const role = roles
        ? await this.prisma.userHasRole.createMany({
            data: roles,
            skipDuplicates: true,
          })
        : [];

      return { role };
    } catch (error) {
      throw new HttpException(
        {
          status: HttpStatus.INTERNAL_SERVER_ERROR,
          error: error.message,
        },
        HttpStatus.INTERNAL_SERVER_ERROR,
        {
          cause: error,
        },
      );
    }
  }
}
