import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UrlEntity } from 'src/url-shortening/url.entity';
import { AuthEntity } from 'src/auth/auth.entity';

@Injectable()
export class AnalyticsService {
  constructor(
    @InjectRepository(UrlEntity)
    private urlRepository: Repository<UrlEntity>,
    @InjectRepository(AuthEntity)
    private authRepository: Repository<AuthEntity>,
  ) {}

  async getAnalytics(username: string): Promise<any> {
    const user = await this.authRepository.findOne({ where: { username } });

    if (!user) {
      throw new Error('User not found');
    }

    const userUrls = await this.urlRepository.find({
      where: { user },
      relations: ['analytics'], // Eager load analytics for each URL
    });

    const analyticsData = userUrls.map((url) => ({
      longUrl: url.longUrl,
      shortUrl: url.shortUrl,
      analytics: url.analytics,
    }));

    return analyticsData;
  }
}
