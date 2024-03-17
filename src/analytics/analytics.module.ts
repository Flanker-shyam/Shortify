import {Module, MiddlewareConsumer} from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AnalyticsEntity } from './analytics.entity';
import { AnalyticsController } from './analytics.controller';
import { AnalyticsService } from './analytics.service';
import { UrlEntity } from 'src/url-shortening/url.entity';
import { AuthEntity } from 'src/auth/auth.entity';
import { JwtService } from '@nestjs/jwt';
import { AuthMiddleware } from 'src/middlewares/auth.middleware';

@Module({
    imports:[TypeOrmModule.forFeature([AnalyticsEntity, UrlEntity, AuthEntity])],
    controllers:[AnalyticsController],
    providers:[AnalyticsService, JwtService],
})

export class AnalyticsModule {
    configure(consume:MiddlewareConsumer){
        consume.apply(AuthMiddleware).forRoutes(AnalyticsController);
    }
}