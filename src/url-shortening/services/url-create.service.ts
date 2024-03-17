import { Injectable } from '@nestjs/common';
import * as crypto from 'crypto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UrlEntity } from '../url.entity';
import { UrlDto } from '../dto/url.dto';

@Injectable()
export class UrlCreateService {
  constructor(
    @InjectRepository(UrlEntity)
    private urlRepository: Repository<UrlEntity>,
  ) {}

  async shortUrl(urlData: UrlDto): Promise<string> {
    const { longUrl, username } = urlData;
    let hash = crypto.createHash('sha256').update(longUrl).digest('hex');
    let shortUrl = hash.substring(0, 8);

    let existingUrl = await this.urlRepository.findOne({ where: { shortUrl } });
    while (existingUrl) {
      hash = crypto.createHash('sha256').update(longUrl).digest('hex');
      shortUrl = hash.substring(0, 8);
      existingUrl = await this.urlRepository.findOne({ where: { shortUrl } });
    }

    const updatedUrlData = {
      longUrl,
      shortUrl,
      username,
    };

    const newUrlData = this.urlRepository.create(updatedUrlData);
    await this.urlRepository.save(newUrlData);
    const updatedUrl = `http://localhost:3000/url/${shortUrl}`;
    return updatedUrl;
  }

  async deleteExpiredUrls(): Promise<void> {
    const expiredUrls = await this.urlRepository
      .createQueryBuilder('UrlEntity')
      .where('UrlEntity.createdAt < :currentDate', {
        currentDate: new Date(Date.now()),
      })
      .getMany();

    await this.urlRepository.remove(expiredUrls);
  }
}
