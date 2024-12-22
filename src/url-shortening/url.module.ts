import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UrlEntity } from './url.entity';
import { UrlController } from './url.controller';
import { UrlCreateService } from './services/url-create.service';
import { UrlLookupService } from './services/url-fetch.service';
import { ScheduleModule } from '@nestjs/schedule';
import { AuthEntity } from 'src/auth/auth.entity';
import { AnalyticsEntity } from 'src/analytics/analytics.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([UrlEntity, AuthEntity, AnalyticsEntity]), // Import and provide the AuthEntity to TypeOrmModule
    ScheduleModule,
  ],
  controllers: [UrlController],
  providers: [UrlCreateService, UrlLookupService], // Remove AuthEntity from providers
})
export class UrlModule {}
