import { Controller, Post, Body, Get, Put } from '@nestjs/common';
import { ReportService } from './report.service';
// import { Comments } from 'src/comments/comments.entity';
import { CreateReportDto } from './dto/create-report.dto';

@Controller('report')
export class ReportController {
  constructor(private readonly reportService: ReportService) {}

  @Post()
  async generate(@Body() payload: CreateReportDto) {
    return this.reportService.generateReport(payload);
  }

  @Get('unread')
  async getUnread() {
    return this.reportService.getUnreadComments();
  }

  @Get('read')
  async geRead() {
    return this.reportService.getReadComments();
  }

  @Put('mark-all-read')
  async markAllAsRead() {
    return this.reportService.markAllUnreadAsRead();
  }
}
