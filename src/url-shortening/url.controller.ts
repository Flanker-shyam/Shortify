
import {Controller, Get, Post, Body, Param, Redirect} from '@nestjs/common';
import {UrlCreateService} from './services/url-create.service';
import {UrlLookupService } from './services/url-fetch.service';
import {UrlDto} from './dto/url.dto';

@Controller('url')
export class UrlController{
    constructor(
        private readonly urlCreateService:UrlCreateService,
        private readonly urlLookupService:UrlLookupService
        ){}

    @Post('short')
    async generateShortUrl( @Body() urlData:UrlDto):Promise<string>{
        return this.urlCreateService.shortUrl(urlData);
    }

    @Get(':shortUrl')
    @Redirect()
    async lookupShortUrl(@Param('shortUrl') shortUrl:string):Promise<string>{
        return this.urlLookupService.urlLookup(shortUrl);
    }
}