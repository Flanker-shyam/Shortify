import { Injectable , Inject,NotFoundException} from '@nestjs/common';
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
        @Inject(CACHE_MANAGER)private cacheService:Cache
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
        const cachedData = await this.cacheService.get<{ longUrl: string }>(shortUrl);
        if(cachedData){
            console.log("Getting data from cache");
            return {url:cachedData}
        }

        const shortUrlData = await this.urlRepository.findOne({where:{shortUrl}})
        if(!shortUrlData){
            throw new NotFoundException('URL not found');
        }

        await this.cacheService.set(shortUrl, shortUrlData.longUrl,60);

        await this.saveAnalytics(shortUrlData, userAgent, referralSource);
        return {url:shortUrlData.longUrl}
    }
}
