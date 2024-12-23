import { AnalyticsDto } from 'src/analytics/analytics.dto';

export class UrlAnalyticsDto {
  longUrl: string;
  shortUrl: string;
  numberOfClicks: number;
  analytics: AnalyticsDto[];
}
