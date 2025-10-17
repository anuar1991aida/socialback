import { Controller, Get, HttpException, HttpStatus, Query, Req, Res } from '@nestjs/common';
import { AccountsService } from './accounts.service';
import { Accounts } from './accounts.entity';
import axios from 'axios'
import { Request, Response } from 'express';

@Controller('accounts')
export class AccountsController {
  constructor(private readonly accountsService: AccountsService) {}

//   @Get()
//   async findAll(): Promise<Accounts[]> {
//     return this.accountsService.getAccounts();
//   }

    @Get()
    async findAll(@Req() req: Request) {
        const accounts = await this.accountsService.getAccounts();

        // Надёжно определяем host/protocol
        const host = req.get('host') || req.headers.host;
        const protocol = (req.headers['x-forwarded-proto'] as string) || req.protocol || 'http';

        return accounts.map(acc => ({
            ...acc,
            profile_pic_url: `${protocol}://${host}/accounts/proxy?url=${encodeURIComponent(acc.profile_pic_url)}`,
        }));
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
