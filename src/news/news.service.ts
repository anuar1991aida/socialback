import { Injectable, NotFoundException } from '@nestjs/common';
import { News } from './entities/news.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

@Injectable()
export class NewsService {
  constructor(
    @InjectRepository(News)
    private readonly newsRepository: Repository<News>,
  ) {}

  async findAll(): Promise<News[]> {
    return this.newsRepository.find({
      order: { createdAt: 'DESC' },
    });
  }

  async findOne(id: number): Promise<News> {
    const news = await this.newsRepository.findOne({ where: { id } });
    if (!news) {
      throw new NotFoundException(`News with ID ${id} not found`);
    }
    return news;
  }

  async findByUrl(url: string): Promise<News | null> {
    return this.newsRepository.findOne({ where: { url } });
  }

  async create(newsData: any): Promise<News> {
    const news = this.newsRepository.create(newsData);
    const savedNews = await this.newsRepository.save(news);
    // TypeORM save может вернуть массив, поэтому берем первый элемент если это массив
    return Array.isArray(savedNews) ? savedNews[0] : savedNews;
  }

  async update(id: number, newsData: any): Promise<News> {
    const news = await this.findOne(id);
    Object.assign(news, newsData);
    const updatedNews = await this.newsRepository.save(news);
    // TypeORM save может вернуть массив, поэтому берем первый элемент если это массив
    return Array.isArray(updatedNews) ? updatedNews[0] : updatedNews;


    
  }

  async remove(id: number): Promise<void> {
    const news = await this.findOne(id);
    await this.newsRepository.remove(news);
  }

  async saveMultipleNews(newsItems: any[]): Promise<{ newItems: number; duplicates: number }> {
    let newItems = 0;
    let duplicates = 0;

    for (const newsData of newsItems) {
      try {
        const existingNews = newsData.url ? await this.findByUrl(newsData.url) : null;
        
        if (!existingNews) {
          await this.create(newsData);
          newItems++;
        } else {
          duplicates++;
        }
      } catch (error) {
        console.warn(`Error saving news: ${error.message}`);
      }
    }

    return { newItems, duplicates };
  }

  async getLatestNews(limit: number = 20): Promise<News[]> {
    return this.newsRepository.find({
      order: { createdAt: 'DESC' },
      take: limit,
    });
  }

  async getStats(): Promise<{ total: number }> {
    const total = await this.newsRepository.count();
    return { total };
  }
}