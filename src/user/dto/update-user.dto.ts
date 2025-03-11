import { PartialType } from '@nestjs/mapped-types';
import { CreateUserDto } from './create-user.dto';
import { IsEmail, MaxLength, MinLength } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class UpdateUserDto extends PartialType(CreateUserDto) {
  @ApiProperty({
    description: 'Update user name',
    example: 'Update Name',
  })
  @MinLength(2)
  @MaxLength(60)
  name: string;

  @ApiProperty({
    description: 'Update email',
    example: 'update@gmail.com',
  })
  @IsEmail()
  email: string;
}
