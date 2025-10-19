import { Module } from '@nestjs/common';
import { PostsService } from './posts.service';
import { PostsController } from './posts.controller';
import { Posts } from './entities/post.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Accounts } from 'src/accounts/accounts.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Posts, Accounts])],
  controllers: [PostsController],
  providers: [PostsService],
})
export class PostsModule {}
