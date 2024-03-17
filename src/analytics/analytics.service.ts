import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UrlEntity } from 'src/url-shortening/url.entity';
import { AuthEntity } from 'src/auth/auth.entity';
import { UrlAnalyticsDto } from 'src/url-shortening/dto/url-response.dto';

@Injectable()
export class AnalyticsService {
  constructor(
    @InjectRepository(UrlEntity)
    private urlRepository: Repository<UrlEntity>,
    @InjectRepository(AuthEntity)
    private authRepository: Repository<AuthEntity>,
  ) {}

  async getAnalytics(username: string): Promise<UrlAnalyticsDto[] | { error: string }> {
    try {
      const user = await this.authRepository.findOne({ where: { username } });
      if (!user) {
        throw new Error('User not found');
      }

      const userUrls = await this.urlRepository.find({
        where: { user: { id: user.id } },
        relations: ['analytics'],
      });

      const analyticsData: UrlAnalyticsDto[] = userUrls.map((url) => ({
        longUrl: url.longUrl,
        shortUrl: url.shortUrl,
        analytics: url.analytics.map((analytic) => ({
          id: analytic.id,
          clickedAtTimeStamp: analytic.clickedAtTimeStamp,
          userAgent: analytic.userAgent,
          referralSource: analytic.referralSource,
          createdAt: analytic.createdAt,
        })),
      }));

      return analyticsData;
    } catch (err) {
      return { error: err.message};
    }
  }
}
