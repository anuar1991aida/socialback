import { Injectable, BadRequestException, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcryptjs';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from 'src/user/user.entity';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User) private usersRepo: Repository<User>,
    private jwtService: JwtService,
  ) {}

  async register(data: { name: string; email: string; password: string }) {
    const existing = await this.usersRepo.findOne({ where: { email: data.email } });
    if (existing) {
      throw new BadRequestException('Пользователь с таким email уже существует');
    }

    const hashed = await bcrypt.hash(data.password, 10);
    const user = this.usersRepo.create({
      name: data.name,
      email: data.email,
      password: hashed,
    });

    await this.usersRepo.save(user);

    // сразу авторизуем после регистрации
    const payload = { sub: user.id, email: user.email };
    return {
      access_token: this.jwtService.sign(payload, { expiresIn: '2m' }),
      user: { id: user.id, name: user.name, email: user.email },
    };
  }

  async validateUser(email: string, password: string) {
    const user = await this.usersRepo.findOne({ where: { email } });
    if (!user || !(await bcrypt.compare(password, user.password))) {
      throw new UnauthorizedException('Неверный email или пароль');
    }
    return user;
  }

  async login(user: User) {
    const payload = { sub: user.id, email: user.email };
    return {
      access_token: this.jwtService.sign(payload, { expiresIn: '2m' }),
    };
  }
}
