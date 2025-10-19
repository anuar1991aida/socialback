import {
  Controller,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  Body,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';
import { ProfileService } from './profile.service';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { Request } from 'express';

@Controller('profile')
export class ProfileController {
  constructor(private readonly profileService: ProfileService) {}

  // ✅ GET /profile — получить профиль текущего пользователя
  @UseGuards(JwtAuthGuard)
  @Get()
  async getMyProfile(@Req() req: Request) {
    const user = req.user as { id: number; email: string };
    return this.profileService.getProfile(user.id);
  }

  // ✅ GET /profile/:id — получить профиль по ID (публично или для админов)
  @Get(':id')
  async getProfileById(@Param('id', ParseIntPipe) id: number) {
    return this.profileService.getProfile(id);
  }

  // ✅ PATCH /profile/:id — обновить профиль (имя, email и т.д.)
  @Patch(':id')
  async updateProfile(
    @Param('id', ParseIntPipe) id: number,
    @Body() body: Partial<{ name: string; email: string }>,
  ) {
    return this.profileService.updateProfile(id, body);
  }

  // ✅ POST /profile/change-password — сменить пароль
  @Post('change-password')
  async changePassword(
    @Body() body: { email: string; oldPassword: string; newPassword: string },
  ) {
    const { email, oldPassword, newPassword } = body;
    return this.profileService.changePasswordByEmail(email, oldPassword, newPassword);
  }
}
