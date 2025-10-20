import { Controller, Get, Post, Body, Patch, Param, Delete, Query, HttpException, Res, HttpStatus, Req } from '@nestjs/common';
import { PostsService } from './posts.service';
import { CreatePostDto } from './dto/create-post.dto';
import { UpdatePostDto } from './dto/update-post.dto';
import axios from 'axios';
import { Request, Response } from 'express';

@Controller('posts')
export class PostsController {
  constructor(private readonly postsService: PostsService) {}

  @Post()
  create(@Body() createPostDto: CreatePostDto) {
    return this.postsService.create(createPostDto);
  }

  @Get()
  async findAll(
    @Req() req: Request,
    @Query('page') page: number = 1,
    @Query('limit') limit: number = 10,
    @Query('accountId') accountId: number,
  ) {
    const [data, total] = await this.postsService.findAll(
        Number(page),
        Number(limit),
        Number(accountId),
      );

      if (!accountId) {
        throw new HttpException('accountId is required', HttpStatus.BAD_REQUEST);
      }

      const host = req.get('host') || req.headers.host;
      const protocol =
        (req.headers['x-forwarded-proto'] as string) || req.protocol || 'http';

      // ⚙️ Получаем аккаунт по ID
      const account = await this.postsService.getAccountById(Number(accountId));

      const accountWithProxy = account
        ? {
            ...account,
            profile_pic_url: account.profile_pic_url
              ? `${protocol}://${host}/accounts/proxy?url=${encodeURIComponent(
                  account.profile_pic_url,
                )}`
              : null,
          }
        : null;

      // ⚙️ Преобразуем изображения постов
      const mappedData = data.map((_post) => ({
        ..._post,
        image_url: _post.image_url
          ? `${protocol}://${host}/accounts/proxy?url=${encodeURIComponent(
              _post.image_url,
            )}`
          : null,
      }));

      return {
        account: accountWithProxy,
        data: mappedData,
        meta: {
          page: Number(page),
          limit: Number(limit),
          total,
          totalPages: Math.ceil(total / Number(limit)),
        },
      };

  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.postsService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updatePostDto: UpdatePostDto) {
    return this.postsService.update(+id, updatePostDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.postsService.remove(+id);
  }

  @Get('proxy')
    async proxyImage(@Query('url') url: string, @Res() res: Response) {
    if (!url) {
        throw new HttpException('url query parameter is required', HttpStatus.BAD_REQUEST);
    }

     const decoded = decodeURIComponent(url);
    
    // 🧠 Проверяем, не base64 ли это
    if (decoded.startsWith('/9j/') || decoded.length > 1000) {
        // Отдаём напрямую как base64 → image/jpeg
        res.setHeader('Content-Type', 'image/jpeg');
        res.send(Buffer.from(decoded, 'base64'));
        return;
    }

    try {
        const resp = await axios.get<ArrayBuffer>(url, { responseType: 'arraybuffer' });
        const contentType = resp.headers['content-type'] || 'image/jpeg';

        res.setHeader('Content-Type', contentType);
        // можно добавить кэш
        res.setHeader('Cache-Control', 'public, max-age=86400');
        res.send(Buffer.from(resp.data));
    } catch (err) {
        throw new HttpException('Failed to fetch image', HttpStatus.BAD_GATEWAY);
    }
    }
}
