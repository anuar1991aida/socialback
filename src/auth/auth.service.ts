import {
  Injectable,
  BadRequestException,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcryptjs';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from 'src/user/user.entity';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User)
    private readonly usersRepo: Repository<User>,
    private readonly jwtService: JwtService,
  ) {}

  // 🔹 Регистрация нового пользователя
  async register(data: { name: string; email: string; password: string }) {
    const { name, email, password } = data;

    // Проверка на существующего пользователя
    const existingUser = await this.usersRepo.findOne({ where: { email } });
    if (existingUser) {
      throw new BadRequestException('Пользователь с таким email уже существует');
    }

    // Хешируем пароль
    const hashedPassword = await bcrypt.hash(password, 10);

    // Создаём нового пользователя
    const user = this.usersRepo.create({
      name,
      email,
      password: hashedPassword,
    });

    await this.usersRepo.save(user);

    // Создаём JWT
    const payload = { sub: user.id, email: user.email };

    return {
      message: 'Регистрация прошла успешно',
      access_token: this.jwtService.sign(payload, { expiresIn: '15m' }), // ⏱ более реальный срок
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
      },
    };
  }

  // 🔹 Проверка корректности пользователя (при логине)
  async validateUser(email: string, password: string): Promise<User> {
    const user = await this.usersRepo.findOne({ where: { email } });

    if (!user) {
      throw new UnauthorizedException('Неверный email или пароль');
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      throw new UnauthorizedException('Неверный email или пароль');
    }

    return user;
  }

  // 🔹 Генерация JWT при логине
  async login(user: User) {
    const payload = { sub: user.id, email: user.email };

    return {
      message: 'Авторизация прошла успешно',
      access_token: this.jwtService.sign(payload, { expiresIn: '15m' }),
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
      },
    };
  }
}
