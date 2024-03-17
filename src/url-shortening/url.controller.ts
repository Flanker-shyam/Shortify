import {Controller, Get, Post, Body, Param, Redirect, Req} from '@nestjs/common';
import {UrlCreateService} from './services/url-create.service';
import {UrlLookupService } from './services/url-fetch.service';
import {UrlDto} from './dto/url-request.dto';
import {Request} from 'express';

@Controller('url')
export class UrlController{
    constructor(
        private readonly urlCreateService:UrlCreateService,
        private readonly urlLookupService:UrlLookupService
        ){}

    @Post('short')
    async generateShortUrl( @Body() urlData:UrlDto):Promise<string|{error:string}>{
        return this.urlCreateService.shortUrl(urlData);
    }

    @Get(':shortUrl')
    @Redirect()
    async lookupShortUrl(@Req() request:Request, @Param('shortUrl') shortUrl:string):Promise<string>{
        const userAgent = request.headers['user-agent'];
        const referralSource = request.headers['referer']?request.headers['referer']:'Direct';
        return this.urlLookupService.urlLookup(shortUrl, userAgent, referralSource);
    }
}