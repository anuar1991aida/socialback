import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AccountsService } from './accounts.service';
import { AccountsController } from './accounts.controller';
import { Accounts } from './accounts.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Accounts])],
  providers: [AccountsService],
  controllers: [AccountsController],
})
export class AccountsModule {}
