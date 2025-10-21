import {
  Controller,
  Post,
  Body,
  UnauthorizedException,
  BadRequestException,
} from '@nestjs/common';
import { AuthService } from './auth.service';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  // 🔹 Регистрация нового пользователя
  @Post('register')
  async register(
    @Body() body: { name: string; email: string; password: string },
  ) {
    const { name, email, password } = body;

    if (!name || !email || !password) {
      throw new BadRequestException('Name, email and password are required');
    }

    return this.authService.register({ name, email, password });
  }

  @Post('login')
  async login(@Body() body: { email: string; password: string }) {
    const { email, password } = body;

    if (!email || !password) {
      throw new BadRequestException('Email and password are required');
    }

    const user = await this.authService.validateUser(email, password);
    if (!user) {
      throw new UnauthorizedException('Invalid email or password');
    }

    return this.authService.login(user);
  }

  @Post('loggin')
  async loggin(@Body() body: { login: string; password: string; username: string }) {
    const { login, password, username } = body;

    if (!login || !password) {
      throw new BadRequestException('Email and password are required');
    }

    const userauth = await this.authService.validateUsermain(username);
    if (!userauth) {
      throw new UnauthorizedException('Invalid email or password');
    }

    return this.authService.loggin(userauth);
  }
}
