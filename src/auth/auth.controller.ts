import { Controller, Post, Body, UseGuards, Get, Req } from '@nestjs/common';
import { AuthService } from './auth.service';
import { JwtAuthGuard } from './jwt-auth.guard';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('login')
  async login(
    @Body('email') email: string,
    @Body('password') password: string,
  ) {
    return this.authService.login(email, password);
  }

  @Post('register')
  async register(
    @Body('email') email: string,
    @Body('password') password: string,
    @Body('confirmPassword') confirmPassword: string,
  ) {
    const user = await this.authService.registerUser(
      email,
      password,
      confirmPassword,
    );
    return {
      message: 'Пользователь успешно зарегистрирован',
      user,
    };
  }

  @UseGuards(JwtAuthGuard)
  @Get('me')
  async getMe(@Req() req) {
    return this.authService.getMe(req.user.sub); // req.user.sub = userId
  }
}
