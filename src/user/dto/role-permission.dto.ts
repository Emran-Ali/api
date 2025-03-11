import { IsEnum, IsOptional } from 'class-validator';
import { Role } from '@prisma/client';
import { ApiProperty } from '@nestjs/swagger';

export class RolePermissionDto {
  @ApiProperty({
    description: 'Role name',
    example: ['ADMIN'],
    required: false,
  })
  @IsOptional()
  @IsEnum(Role, { each: true, message: 'Role must be either USER or ADMIN' })
  roles?: Role[];

  @ApiProperty({
    description: 'User permission keys',
    example: ['create-task', 'delete-task'],
    required: false,
  })
  permissions?: string[];
}
