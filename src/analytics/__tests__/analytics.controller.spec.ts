import { Test } from '@nestjs/testing';
import { AnalyticsController } from '../analytics.controller';
import { AnalyticsService } from '../analytics.service';
import { Repository } from 'typeorm';
import { getRepositoryToken } from '@nestjs/typeorm';
import { UrlEntity } from '../../url-shortening/url.entity';
import { AuthEntity } from '../../auth/auth.entity';
import { JwtService } from '@nestjs/jwt';

describe('AnalyticsController', () => {
  let controller: AnalyticsController;
  let service: AnalyticsService;

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      controllers: [AnalyticsController],
      providers: [
        AnalyticsService,
        {
          provide: getRepositoryToken(UrlEntity),
          useClass: Repository,
        },
        {
          provide: getRepositoryToken(AuthEntity),
          useClass: Repository,
        },
        JwtService,
      ],
    }).compile();

    controller = module.get<AnalyticsController>(AnalyticsController);
    service = module.get<AnalyticsService>(AnalyticsService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('getAnalytics', () => {
    it('should return analytics data for a valid username', async () => {
      const testUser = { username: 'testUser12@gmail.com' };
      const analyticsData = [
        {
          longUrl:
            'https://developer.mozilla.org/en-US/docs/Web/API/WebSockets_API/Writing_WebSocket_servers',
          shortUrl: '63f6a6fa',
          analytics: [
            {
              id: 1,
              clickedAtTimeStamp: new Date(),
              userAgent:
                'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/121.0.0.0 Safari/537.36',
              referralSource: 'Direct',
              createdAt: new Date(),
            },
          ],
        },
      ];

      jest.spyOn(service, 'getAnalytics').mockResolvedValue(analyticsData);
      const result = await controller.getAnalytics(testUser);

      expect(result).toEqual(analyticsData);
    });

    it('should return an error message for invalid username', async () => {
      const userData = { username: 'invalidUser' };
      const errorMessage = 'User not found';
      jest
        .spyOn(service, 'getAnalytics')
        .mockResolvedValue({ error: errorMessage });

      const result = await controller.getAnalytics(userData);
      
      expect(result).toEqual({ error: errorMessage });
    });
  });
});
