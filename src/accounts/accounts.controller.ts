import {
  Controller,
  Get,
  HttpException,
  HttpStatus,
  Query,
  Req,
  Res,
} from '@nestjs/common';
import { AccountsService } from './accounts.service';
import axios from 'axios';
import { Request, Response } from 'express';
import { saveBase64File } from 'src/posts/save-base64-file';

// ⚙️ Правильный импорт


@Controller('accounts')
export class AccountsController {
  constructor(private readonly accountsService: AccountsService) {}

  @Get()
  async findAll(@Req() req: Request) {
    const accounts = await this.accountsService.getAccounts();

    // Надёжно определяем host/protocol
    const host = req.get('host') || req.headers.host;
    const protocol =
      (req.headers['x-forwarded-proto'] as string) || req.protocol || 'http';

    const updatedAccounts = await Promise.all(
      accounts.map(async (acc) => {
        const url = acc.profile_pic_url;

        // ⭐ ЛУЧШАЯ проверка base64 (как в posts)
        const isBase64 =
          typeof url === 'string' &&
          (url.startsWith('data:image/') ||
            /^[A-Za-z0-9+/=]+$/.test(url) && url.length > 200);

        if (isBase64) {
          // 📌 Сохраняем base64
          const saved = await saveBase64File(
            acc.profile_pic_url,
            'accounts',
            `${acc.id}`,
          );
          acc.profile_pic_url = `${protocol}://${host}${saved}`;
        } else {
          // 📌 Просто URL → через proxy
          acc.profile_pic_url = `${protocol}://${host}/accounts/proxy?url=${encodeURIComponent(
            acc.profile_pic_url,
          )}`;
        }

        return acc;
      }),
    );

    return updatedAccounts;
  }

  @Get('proxy')
  async proxyImage(@Query('url') url: string, @Res() res: Response) {
    if (!url) {
      throw new HttpException(
        'url query parameter is required',
        HttpStatus.BAD_REQUEST,
      );
    }

    const decoded = decodeURIComponent(url);

    // 🧠 проверка base64
    if (decoded.startsWith('data:image/') || decoded.length > 1000) {
      const base64 = decoded.replace(/^data:.+;base64,/, '');
      res.setHeader('Content-Type', 'image/jpeg');
      res.send(Buffer.from(base64, 'base64'));
      return;
    }

    try {
      const resp = await axios.get<ArrayBuffer>(url, {
        responseType: 'arraybuffer',
      });
      const contentType = resp.headers['content-type'] || 'image/jpeg';

      res.setHeader('Content-Type', contentType);
      res.setHeader('Cache-Control', 'public, max-age=86400');
      res.send(Buffer.from(resp.data));
    } catch (err) {
      throw new HttpException('Failed to fetch image', HttpStatus.BAD_GATEWAY);
    }
  }
}
