import { Body, Controller, Post, Req, ValidationPipe } from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginDto } from './dto/login.dto';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('/login')
  login(@Body(ValidationPipe) credential: LoginDto) {
    return this.authService.loginUser(credential);
  }

  @Post('/logout')
  logout(@Req() req: any) {
    const token: string = req.headers.authorization?.split(' ')[1];
    return this.authService.logoutUser(token);
  }
}
