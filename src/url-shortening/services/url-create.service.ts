import { Injectable } from '@nestjs/common';
import * as crypto from 'crypto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UrlEntity } from '../url.entity';
import { UrlDto } from '../dto/url-request.dto';
import { AuthEntity } from '../../auth/auth.entity';
import { validateData } from '../../helpers/validate';

@Injectable()
export class UrlCreateService {
  constructor(
    @InjectRepository(UrlEntity)
    private urlRepository: Repository<UrlEntity>,
    @InjectRepository(AuthEntity)
    private authRepository: Repository<AuthEntity>,
  ) {}

  async shortUrl(urlData: UrlDto): Promise<string | { error: string }> {
    await validateData(urlData, UrlDto);
    try {
      const { longUrl, userId } = urlData;
      const userData = await this.authRepository.findOne({
        where: { username: userId },
      });

      console.log('userData', userData);
      if (!userData) {
        throw new Error('User not found');
      }

      const existingLongUrl = await this.urlRepository.findOne({
        where: { longUrl },
      });
      if (existingLongUrl) {
        return `${process.env.BASE_URL}/url/${existingLongUrl.shortUrl}`;
      }

      let hash = crypto.createHash('sha256').update(longUrl).digest('hex');
      let shortUrl = hash.substring(0, 8);

      let existingUrl = await this.urlRepository.findOne({
        where: { shortUrl },
      });
      while (existingUrl) {
        hash = crypto.createHash('sha256').update(longUrl).digest('hex');
        shortUrl = hash.substring(0, 8);
        existingUrl = await this.urlRepository.findOne({ where: { shortUrl } });
      }

      const updatedUrlData = {
        longUrl,
        shortUrl,
        user: userData,
      };

      const newUrlData = this.urlRepository.create(updatedUrlData);
      await this.urlRepository.save(newUrlData);
      const updatedUrl = `${process.env.BASE_URL}/url/${newUrlData.shortUrl}`;
      return updatedUrl;
    } catch (err) {
      return { error: err.message };
    }
  }

  async deleteExpiredUrls(): Promise<void | { error: string }> {
    try {
      const expiredUrls = await this.urlRepository
        .createQueryBuilder('UrlEntity')
        .where('UrlEntity.createdAt < :currentDate', {
          currentDate: new Date(Date.now()),
        })
        .getMany();

      await this.urlRepository.remove(expiredUrls);
    } catch (err) {
      return { error: err.message };
    }
  }
}
