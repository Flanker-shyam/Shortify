import { Test } from '@nestjs/testing';
import { Repository } from 'typeorm';
import { getRepositoryToken } from '@nestjs/typeorm';
import { UrlEntity } from '../../url.entity';
import { AnalyticsEntity } from '../../../analytics/analytics.entity';
import { UrlLookupService } from '../../services/url-fetch.service';
import { Cache } from 'cache-manager';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { NotFoundException } from '@nestjs/common';

describe('UrlLookupService', () => {
  let urlLookupService: UrlLookupService;
  let urlRepository: Repository<UrlEntity>;
  let analyticsRepository: Repository<AnalyticsEntity>;
  let cacheService: Cache;

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      providers: [
        UrlLookupService,
        {
          provide: getRepositoryToken(UrlEntity),
          useClass: Repository,
        },
        {
          provide: getRepositoryToken(AnalyticsEntity),
          useClass: Repository,
        },
        {
          provide: CACHE_MANAGER,
          useValue: {
            get: jest.fn(),
            set: jest.fn(),
          },
        },
      ],
    }).compile();

    urlLookupService = module.get<UrlLookupService>(UrlLookupService);
    urlRepository = module.get<Repository<UrlEntity>>(
      getRepositoryToken(UrlEntity),
    );
    analyticsRepository = module.get<Repository<AnalyticsEntity>>(
      getRepositoryToken(AnalyticsEntity),
    );
    cacheService = module.get<Cache>(CACHE_MANAGER);
  });

  describe('saveAnalytics', () => {
    it('should save analytics data', async () => {
      // Mock data and parameters
      const mockShortUrlData = {
        id: 1,
        shortUrl: 'abc1237',
        longUrl: 'http://example.com',
      };
      const mockUserAgent = 'Mock User Agent';
      const mockReferralSource = 'Mock Referral Source';

      // Mock the save function of the analyticsRepository
      jest.spyOn(analyticsRepository, 'save').mockResolvedValue(null);

      // Call the function being tested
      await urlLookupService.saveAnalytics(
        mockShortUrlData,
        mockUserAgent,
        mockReferralSource,
      );

      // Check if the save function was called with the correct parameters
      expect(analyticsRepository.save).toHaveBeenCalledWith({
        userAgent: mockUserAgent,
        referralSource: mockReferralSource,
        clickedAtTimeStamp: expect.any(Date),
        url: mockShortUrlData,
      });
    });
  });

  describe('urlLookup', () => {
    it('should return cached data if available', async () => {
      const mockCachedData = { longUrl: 'http://example.com' };
      const mockShortUrl = 'abc1237';
      const mockUserAgent = 'Mock User Agent';
      const mockReferralSource = 'Mock Referral Source';

      jest.spyOn(cacheService, 'get').mockResolvedValue(mockCachedData);

      const result = await urlLookupService.urlLookup(
        mockShortUrl,
        mockUserAgent,
        mockReferralSource,
      );

      expect(result).toEqual({ url: mockCachedData });
    });

    it('should return URL not found if data is not cached or found in the database', async () => {
      const mockShortUrl = 'a23uybn';
      const mockUserAgent = 'Mock User Agent';
      const mockReferralSource = 'Mock Referral Source';

      jest.spyOn(cacheService, 'get').mockResolvedValue(null);
      jest.spyOn(urlRepository, 'findOne').mockResolvedValue(null);

      await expect(
        urlLookupService.urlLookup(
          mockShortUrl,
          mockUserAgent,
          mockReferralSource,
        ),
      ).rejects.toThrowError(NotFoundException);
    });

    it('should save analytics and return URL data if not cached', async () => {
      const mockUser = {
        id: 1,
        name: 'flanker',
        username: 'testUser@gmail.com',
        password: 'F&1gh6fdef',
        urls: [],
        createdAt: new Date(),
        updatedAt: new Date(),
      };
      const mockShortUrlData = {
        id: 1,
        longUrl: 'http://example.com',
        shortUrl: 'abc1237',
        analytics: [],
        user: mockUser,
        createdAt: new Date(),
        expiresAt: new Date(),
        setExpirationDate: jest.fn(),
      };
      const mockUserAgent = 'Mock User Agent';
      const mockReferralSource = 'Mock Referral Source';

      jest.spyOn(cacheService, 'get').mockResolvedValue(null);
      jest.spyOn(urlRepository, 'findOne').mockResolvedValue(mockShortUrlData);
      jest.spyOn(analyticsRepository, 'save').mockResolvedValue(null);

      const result = await urlLookupService.urlLookup(
        mockShortUrlData.shortUrl,
        mockUserAgent,
        mockReferralSource,
      );

      expect(result).toEqual({ url: mockShortUrlData.longUrl });
      expect(cacheService.set).toHaveBeenCalledWith(
        mockShortUrlData.shortUrl,
        mockShortUrlData.longUrl,
        60,
      );
      expect(analyticsRepository.save).toHaveBeenCalledWith({
        userAgent: mockUserAgent,
        referralSource: mockReferralSource,
        clickedAtTimeStamp: expect.any(Date),
        url: mockShortUrlData,
      });
    });
  });
});
