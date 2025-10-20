import {
  Injectable,
  NotFoundException,
  BadRequestException,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from 'src/user/user.entity';
import * as bcrypt from 'bcryptjs';

@Injectable()
export class ProfileService {
  constructor(
    @InjectRepository(User)
    private readonly usersRepo: Repository<User>,
  ) {}

  // ✅ Получение профиля по ID (или текущего пользователя)
  async getProfile(id: number) {
    const user = await this.usersRepo.findOne({ where: { id } });
    if (!user) throw new NotFoundException('Пользователь не найден');

    // Убираем конфиденциальные данные
    const { password, resetToken, resetTokenExp, ...safeUser } = user as any;
    return safeUser;
  }

  // ✅ Обновить профиль
  async updateProfile(id: number, payload: Partial<User>) {
    const user = await this.usersRepo.findOne({ where: { id } });
    if (!user) throw new NotFoundException('Пользователь не найден');

    if (payload.password) delete payload.password; // нельзя менять пароль здесь
    Object.assign(user, payload);

    await this.usersRepo.save(user);

    const { password, resetToken, resetTokenExp, ...safeUser } = user as any;
    return safeUser;
  }

  // ✅ Смена пароля по email
  async changePasswordByEmail(
    email: string,
    oldPassword: string,
    newPassword: string,
  ) {
    if (!email || !oldPassword || !newPassword) {
      throw new BadRequestException('Email, старый и новый пароль обязательны');
    }

    const user = await this.usersRepo.findOne({ where: { email } });
    if (!user) throw new NotFoundException('Пользователь не найден');

    const isMatch = await bcrypt.compare(oldPassword, user.password);
    if (!isMatch) {
      throw new UnauthorizedException('Текущий пароль неверный');
    }

    user.password = await bcrypt.hash(newPassword, 10);
    await this.usersRepo.save(user);

    return {
      message: 'Пароль успешно изменён',
      userId: user.id,
    };
  }
}
