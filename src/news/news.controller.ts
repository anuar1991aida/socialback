import { Controller, Get, Post, Put, Delete, Param, Body, Query, HttpCode, HttpStatus } from '@nestjs/common';
import { NewsService } from './news.service';
import { News } from './entities/news.entity';

@Controller('news')
export class NewsController {
  constructor(private readonly newsService: NewsService) {}

  @Get()
  async getAllNews(): Promise<News[]> {
    return this.newsService.findAll();
  }

  @Get('latest')
  async getLatestNews(@Query('limit') limit: number = 20): Promise<News[]> {
    return this.newsService.getLatestNews(limit);
  }

  @Get('stats')
  async getStats() {
    return this.newsService.getStats();
  }

  @Get(':id')
  async getNewsById(@Param('id') id: number): Promise<News> {
    return this.newsService.findOne(id);
  }

  @Post()
  @HttpCode(HttpStatus.CREATED)
  async createNews(@Body() newsData: any): Promise<News> {
    return this.newsService.create(newsData);
  }

  @Put(':id')
  async updateNews(
    @Param('id') id: number,
    @Body() newsData: any,
  ): Promise<News> {
    return this.newsService.update(id, newsData);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  async deleteNews(@Param('id') id: number): Promise<void> {
    return this.newsService.remove(id);
  }

  @Post('parse')
  async parseNews(): Promise<any> {
    return { success: true, message: 'Parsing completed' };
  }

  @Post('batch')
  async createMultipleNews(@Body() newsItems: any[]): Promise<{ newItems: number; duplicates: number }> {
    return this.newsService.saveMultipleNews(newsItems);
  }
}