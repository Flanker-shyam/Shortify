import { Injectable , NotFoundException} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UrlEntity } from '../url.entity';
import { AnalyticsEntity } from 'src/analytics/analytics.entity';

@Injectable()
export class UrlLookupService {
    constructor(
        @InjectRepository(UrlEntity)
        private urlRepository: Repository<UrlEntity>,
        @InjectRepository(AnalyticsEntity)
        private analyticsRepository: Repository<AnalyticsEntity>,
    ) {}

    async saveAnalytics(shortUrlData:any, userAgent:string, referralSource:string){
        const timeStamp = new Date(Date.now());
        const analyticsData = new AnalyticsEntity();
        analyticsData.userAgent = userAgent;
        analyticsData.referralSource = referralSource;
        analyticsData.clickedAtTimeStamp = timeStamp;
        analyticsData.url = shortUrlData;
        await this.analyticsRepository.save(analyticsData);
    }

    async urlLookup(shortUrl: string, userAgent:string, referralSource:string):Promise<any>{

        const shortUrlData = await this.urlRepository.findOne({where:{shortUrl}})
        if(!shortUrlData){
            return new NotFoundException('URL not found');
        }
    
        await this.saveAnalytics(shortUrlData, userAgent, referralSource);
        return {url:shortUrlData.longUrl}
    }
}
