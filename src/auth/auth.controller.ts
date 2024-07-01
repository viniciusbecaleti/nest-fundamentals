import { Body, Controller, HttpCode, HttpStatus, Post } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthResponseDto } from './auth.dto';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('login')
  @HttpCode(HttpStatus.OK)
  signIn(
    @Body('email') email: string,
    @Body('password') password: string,
  ): AuthResponseDto {
    return this.authService.signIn(email, password);
  }
}
