import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Accounts } from './accounts.entity';
import { Repository } from 'typeorm';

@Injectable()
export class AccountsService {
    constructor(
        @InjectRepository(Accounts)
        private accountsRepo: Repository<Accounts>,
      ) {}
      
  async getAccounts(): Promise<Accounts[]> {
    return await this.accountsRepo.find();
  }
}
