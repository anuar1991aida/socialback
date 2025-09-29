import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn } from 'typeorm';

@Entity('users')
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ length: 100 })
  name: string;

  @Column({ unique: true })
  email: string;

  // 🔑 Хэш пароля
  @Column()
  password: string;

  // 🔹 Токен для восстановления пароля (опционально)
  @Column({ nullable: true })
  resetToken: string;

  // 🔹 Время жизни токена
  @Column({ type: 'timestamp', nullable: true })
  resetTokenExp: Date;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}