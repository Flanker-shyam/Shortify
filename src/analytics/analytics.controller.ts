import {Controller,Param,Get} from '@nestjs/common';
import { AnalyticsService } from './analytics.service';
import { UrlDto } from 'src/url-shortening/dto/url.dto';

@Controller('analytics')
export class AnalyticsController{
    constructor(
        private readonly analyticsService:AnalyticsService,
    ){}

    @Get(':username')
    async getAnalytics(@Param('username') username:string):Promise<any>{
        return this.analyticsService.getAnalytics(username);
    }
}