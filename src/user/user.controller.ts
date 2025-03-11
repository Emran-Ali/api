import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  ValidationPipe,
  UseGuards,
  ParseIntPipe,
} from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { PermissionGuard } from '../guards/permission.guard';
import { Permission } from '../decorators/permission.decorator';
import { Public } from 'src/guards/public.guard';
import { RolePermissionDto } from './dto/role-permission.dto';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('Users')
@Controller('users')
@UseGuards(JwtAuthGuard, PermissionGuard)
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post()
  @Public()
  create(@Body(ValidationPipe) createUserDto: CreateUserDto) {
    return this.userService.create(createUserDto);
  }

  @Get()
  @Permission('read-users')
  findAll() {
    return this.userService.findAll({});
  }

  @Get(':id')
  @Permission('update-user')
  findOne(@Param('id') id: number) {
    return this.userService.findOne(id);
  }

  @Patch(':id')
  @Permission('read-users')
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body(ValidationPipe) updateUserDto: UpdateUserDto,
  ) {
    return this.userService.update(id, updateUserDto);
  }

  @Delete(':id')
  @Permission('delete-user')
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.userService.remove(+id);
  }

  @Patch(':id/sync-permissions')
  @Permission('sync-role-permission')
  sync(
    @Param('id', ParseIntPipe) id: number,
    @Body(ValidationPipe) rolePermission: RolePermissionDto,
  ) {
    return this.userService.syncRolePermission(id, rolePermission);
  }
}
