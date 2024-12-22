import { Controller, UseGuards, Get, Body } from '@nestjs/common';
import { AnalyticsService } from './analytics.service';
import { UrlAnalyticsDto } from '../url-shortening/dto/url-response.dto';
import { AuthMiddleware } from '../middlewares/auth.middleware';

@Controller('analytics')
@UseGuards(AuthMiddleware)
export class AnalyticsController {
  constructor(private readonly analyticsService: AnalyticsService) {}

  @Get()
  async getAnalytics(
    @Body() userData: { username: string },
  ): Promise<UrlAnalyticsDto[] | { error: string }> {
    const { username } = userData;
    return this.analyticsService.getAnalytics(username);
  }
}
