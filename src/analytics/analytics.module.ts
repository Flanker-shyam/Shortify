import {Module} from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AnalyticsEntity } from './analytics.entity';
import { AnalyticsController } from './analytics.controller';
import { AnalyticsService } from './analytics.service';

@Module({
    imports:[TypeOrmModule.forFeature([AnalyticsEntity])],
    controllers:[AnalyticsController],
    providers:[AnalyticsService],
})

export class AnalyticsModule {}