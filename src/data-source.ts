import { DataSource } from 'typeorm';
import { User } from './user/user.entity';
import { Comments } from './comments/comments.entity';
import { Posts } from './posts/entities/post.entity';
import { Accounts } from './accounts/accounts.entity';
// import { User } from './users/user.entity';

export const AppDataSource = new DataSource({
  type: 'postgres',
  host: '192.168.5.42',
  port: 5432,
  username: 'postgres',   // свой логин
  password: '147258',      // свой пароль
  database: 'social',
  entities: [User, Accounts, Posts, Comments ],
  migrations: ['src/migrations/*.ts'],
  synchronize: false, // всегда false в проде
});
