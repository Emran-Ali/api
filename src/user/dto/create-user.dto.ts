import {
  IsEmail,
  IsNotEmpty,
  IsString,
  MaxLength,
  MinLength,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateUserDto {
  @ApiProperty({
    description: 'Email address',
    example: 'test@gmail.com',
  })
  @IsNotEmpty()
  @IsEmail()
  email: string;

  @ApiProperty({
    description: 'Full Name',
    example: 'John Doe',
  })
  @IsNotEmpty()
  @IsString()
  @MinLength(1)
  @MaxLength(60)
  name: string;

  @ApiProperty({
    description: 'Strong Password',
    example: 'asdfrewq',
  })
  @IsNotEmpty()
  @IsString()
  @MinLength(5)
  password: string;
}
