import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ReportService } from './report.service';
import { ReportController } from './report.controller';
import { Comments } from 'src/comments/comments.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Comments])],
  controllers: [ReportController],
  providers: [ReportService],
})
export class ReportModule {}
