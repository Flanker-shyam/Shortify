import { Injectable , NotFoundException} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UrlEntity } from '../url.entity';

@Injectable()
export class UrlLookupService {
    constructor(
        @InjectRepository(UrlEntity)
        private urlRepository: Repository<UrlEntity>,
    ) {}

    async urlLookup(shortUrl: string):Promise<any>{
        const shortUrlData = await this.urlRepository.findOne({where:{shortUrl}})
        if(!shortUrlData){
            return new NotFoundException('URL not found');
        }
        return {url:shortUrlData.longUrl}
    }
}
