import {
  Injectable,
  Inject,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UrlEntity } from '../url.entity';
import { AnalyticsEntity } from '../../analytics/analytics.entity';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Cache } from 'cache-manager';

@Injectable()
export class UrlLookupService {
  constructor(
    @InjectRepository(UrlEntity)
    private urlRepository: Repository<UrlEntity>,
    @InjectRepository(AnalyticsEntity)
    private analyticsRepository: Repository<AnalyticsEntity>,
    @Inject(CACHE_MANAGER) private cacheService: Cache,
  ) {}

  isValidUsername(username: string): boolean {
    const regex = /^[a-zA-Z0-9]{0,8}$/;
    return regex.test(username);
  }

  async saveAnalytics(
    shortUrlData: any,
    userAgent: string,
    referralSource: string,
  ) {
    try {
      const timeStamp = new Date(Date.now());
      const analyticsData = new AnalyticsEntity();
      analyticsData.userAgent = userAgent;
      analyticsData.referralSource = referralSource;
      analyticsData.clickedAtTimeStamp = timeStamp;
      analyticsData.url = shortUrlData;
      await this.analyticsRepository.save(analyticsData);
    } catch (err) {
      throw new BadRequestException(err.message);
    }
  }

  async urlLookup(
    shortUrl: string,
    userAgent: string,
    referralSource: string,
  ): Promise<any> {
    try {
      if (!this.isValidUsername) {
        throw new NotFoundException('Invalid short URL');
      }
      let cachedData = await this.cacheService.get<{ longUrl: string }>(
        shortUrl,
      );

      if (cachedData) {
        let parsedCachedData = JSON.parse(JSON.stringify(cachedData));
        this.saveAnalytics(parsedCachedData, userAgent, referralSource);
        console.log('Getting data from cache');
        return { url: parsedCachedData.longUrl };
      }

      const shortUrlData = await this.urlRepository.findOne({
        where: { shortUrl },
      });
      if (!shortUrlData) {
        throw new NotFoundException('URL not found');
      }

      await this.cacheService.set(
        JSON.stringify(shortUrlData),
        shortUrlData.longUrl,
        60,
      );

      await this.saveAnalytics(shortUrlData, userAgent, referralSource);
      return { url: shortUrlData.longUrl };
    } catch (err) {
      throw new BadRequestException(err.message);
    }
  }
}
