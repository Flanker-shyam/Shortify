import { Test, TestingModule } from '@nestjs/testing';
import { AnalyticsService } from '../analytics.service';
import { Repository } from 'typeorm';
import { UrlEntity } from '../../url-shortening/url.entity';
import { AuthEntity } from '../../auth/auth.entity';
import { getRepositoryToken } from '@nestjs/typeorm';

describe('AnalyticsService', () => {
  let service: AnalyticsService;
  let urlRepository: Repository<UrlEntity>;
  let authRepository: Repository<AuthEntity>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
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
      ],
    }).compile();

    service = module.get<AnalyticsService>(AnalyticsService);
    urlRepository = module.get<Repository<UrlEntity>>(
      getRepositoryToken(UrlEntity),
    );
    authRepository = module.get<Repository<AuthEntity>>(
      getRepositoryToken(AuthEntity),
    );
  });

  describe('getAnalytics', () => {
    it('should return analytics data for a valid username', async () => {
      const mockUser = {
        id: 1,
        name: 'flanker',
        username: 'testUser@gmail.com',
        password: 'F&1gh6fdef',
        urls: [],
        createdAt: new Date(),
        updatedAt: new Date(),
      };
      const mockUrls = [
        {
          id: 1,
          longUrl: 'http://example.com',
          shortUrl: 'abc1238',
          analytics: [],
          user: mockUser,
          createdAt: new Date(),
          expiresAt: new Date(),
          setExpirationDate: jest.fn(),
        },
      ];

      jest.spyOn(authRepository, 'findOne').mockResolvedValue(mockUser);
      jest.spyOn(urlRepository, 'find').mockResolvedValue(mockUrls);

      const result = await service.getAnalytics('testUser');
      
      expect(result).toEqual([
        {
          longUrl: 'http://example.com',
          shortUrl: 'abc1238',
          numberOfClicks: 0,
          analytics: [],
        },
      ]);
    });

    it('should return an error message for an invalid username', async () => {
      jest.spyOn(authRepository, 'findOne').mockResolvedValue(null);

      const result = await service.getAnalytics('invalidUser');

      expect(result).toEqual({ error: 'User not found' });
    });
  });
});
