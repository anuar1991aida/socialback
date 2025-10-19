import { Injectable } from '@nestjs/common';
import { CreatePostDto } from './dto/create-post.dto';
import { UpdatePostDto } from './dto/update-post.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Posts } from './entities/post.entity';
import { Repository } from 'typeorm';
import { Comments } from 'src/comments/comments.entity';

@Injectable()
export class PostsService {
  findAllAndCount(arg0: number, arg1: number, arg2: number): [any, any] | PromiseLike<[any, any]> {
    throw new Error('Method not implemented.');
  }
  constructor(
    @InjectRepository(Posts)
    private postsRepo: Repository<Posts>,
    // private commentsRepo: Repository<Comments>,
  ) {}

  
  create(createPostDto: CreatePostDto) {
    return 'This action adds a new post';
  }


  
  async findAll(page: number = 1, limit: number = 10, accountId: number) {
    const qb = this.postsRepo
      .createQueryBuilder('post')
      .leftJoin('comments', 'c', 'c.posts_id = post.id')
      .select([
        'post.id AS id',
        'post.content AS content',
        'post.created AS created',
        'MAX(post.image_url) AS image_url',
        'MAX(post.video_url) AS video_url',
        `SUM(CASE WHEN c.label = 'positive' THEN 1 ELSE 0 END) AS positive`,
        `SUM(CASE WHEN c.label = 'negative' THEN 1 ELSE 0 END) AS negative`,
        `SUM(CASE WHEN c.label = 'neutral' THEN 1 ELSE 0 END) AS neutral`,
      ])
      .where('post.accounts_id = :accountId', { accountId })
      .groupBy('post.id')
      .orderBy('post.id', 'ASC')
      // .skip((page - 1) * limit)
      .take(50);
  
    const data = await qb.getRawMany();
  
    // отдельный запрос только для подсчёта постов
    const total = await this.postsRepo
      .createQueryBuilder('post')
      .where('post.accounts_id = :accountId', { accountId })
      .getCount();
  
    return [data, total] as const;
  }

  

  findOne(id: number) {
    return `This action returns a #${id} post`;
  }

  update(id: number, updatePostDto: UpdatePostDto) {
    return `This action updates a #${id} post`;
  }

  remove(id: number) {
    return `This action removes a #${id} post`;
  }
}
