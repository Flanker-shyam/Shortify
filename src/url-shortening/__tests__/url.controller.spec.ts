import { Test } from '@nestjs/testing';
import { UrlCreateService } from '../services/url-create.service';
import { UrlLookupService } from '../services/url-fetch.service';
import { UrlController } from '../url.controller';
import { AuthEntity } from '../../auth/auth.entity';
import { Repository } from 'typeorm';
import { getRepositoryToken } from '@nestjs/typeorm';
import { UrlEntity } from '../url.entity';
import { AnalyticsEntity } from '../../analytics/analytics.entity';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { UrlAnalyticsDto } from '../dto/url-response.dto';
import { UrlDto } from '../dto/url-request.dto';
import { Request } from 'express';

describe('UrlController', () => {
  let urlController: UrlController;
  let urlCreateService: UrlCreateService;
  let urlLookupService: UrlLookupService;

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      controllers: [UrlController],
      providers: [
        UrlCreateService,
        UrlLookupService,
        {
          provide: getRepositoryToken(UrlEntity),
          useClass: Repository,
        },
        {
          provide: getRepositoryToken(AuthEntity),
          useClass: Repository,
        },
        {
          provide: getRepositoryToken(AnalyticsEntity),
          useClass: Repository,
        },
        {
          provide: CACHE_MANAGER,
          useValue: {},
        },
      ],
    }).compile();

    urlController = module.get<UrlController>(UrlController);
    urlCreateService = module.get<UrlCreateService>(UrlCreateService);
    urlLookupService = module.get<UrlLookupService>(UrlLookupService);
  });

  it('Should be defined', () => {
    expect(urlController).toBeDefined();
  });

  describe('generateShortUrl', () => {
    it('should generate a short URL', async () => {
      const urlData: UrlDto = {
        userId: 'flanker',
        longUrl: 'https://dev.to/itsnitinr.com',
      };
      const shortUrl = 'mockShortUrl';
      jest.spyOn(urlCreateService, 'shortUrl').mockResolvedValue(shortUrl);

      const result = await urlController.generateShortUrl(urlData);

      expect(result).toEqual(shortUrl);
    });
  });

  describe('lookupShortUrl', () => {
    it('should lookup a short URL', async () => {
      const request: Request = {
        headers: {
          'user-agent': 'Mock user agent',
           referer: 'Mock referer',
        },
      } as Request;
      const shortUrl = 'mockShortUrl';
      const lookupResult = 'mockRedirectUrl';
      jest.spyOn(urlLookupService, 'urlLookup').mockResolvedValue(lookupResult);

      const result = await urlController.lookupShortUrl(request, shortUrl);

      expect(result).toEqual(lookupResult);
    });
  });
});
