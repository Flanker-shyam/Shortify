import { Test } from '@nestjs/testing';
import { UrlCreateService } from '../../services/url-create.service';
import { Repository } from 'typeorm';
import { getRepositoryToken } from '@nestjs/typeorm';
import { UrlEntity } from '../../url.entity';
import { AuthEntity } from '../../../auth/auth.entity';

describe('UrlCreateService', () => {
  let urlCreateService: UrlCreateService;
  let urlRepository: Repository<UrlEntity>;
  let authRepository: Repository<AuthEntity>;

  const urlData = {
    longUrl: 'http://example.com',
    userId: 'testUser',
  };
  const userData = {
    name: 'flanker',
    username: 'flanker1234@gmail.com',
    password: 'Flanker@1234',
    id: 1,
    createdAt: new Date(),
    updatedAt: new Date(),
    urls: [],
  };
  const mockUrlEntity = {
    id: 1,
    longUrl: 'http://example.com',
    shortUrl: 'abc123',
    analytics: [],
    user: userData,
    createdAt: new Date(),
    expiresAt: new Date(),
    setExpirationDate: jest.fn(),
  };
  const mockExistingUrlEntity = null;
  const mockNewUrlEntity = {
    ...mockUrlEntity,
    shortUrl: 'mockShortUrl2',
  };

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      providers: [
        UrlCreateService,
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

    urlCreateService = module.get<UrlCreateService>(UrlCreateService);
    urlRepository = module.get<Repository<UrlEntity>>(
      getRepositoryToken(UrlEntity),
    );
    authRepository = module.get<Repository<AuthEntity>>(
      getRepositoryToken(AuthEntity),
    );
  });

  describe('shortUrl', () => {
    it('should create a short URL for a valid long URL and user ID', async () => {
      jest.spyOn(authRepository, 'findOne').mockResolvedValue(userData);
      jest
        .spyOn(urlRepository, 'findOne')
        .mockResolvedValue(mockExistingUrlEntity);
      jest.spyOn(urlRepository, 'create').mockReturnValue(mockNewUrlEntity);
      jest.spyOn(urlRepository, 'save').mockResolvedValue(mockNewUrlEntity);

      const result = await urlCreateService.shortUrl(urlData);

      expect(result).toEqual(
        `${process.env.BASE_URL}/url/${mockNewUrlEntity.shortUrl}`,
      );
    });

    it('should return an existing short URL if the long URL already exists in the database', async () => {
      const mockExistingUrlEntity = {
        ...mockUrlEntity,
        shortUrl: 'mockShortUrl2',
      };

      jest.spyOn(authRepository, 'findOne').mockResolvedValue(userData);
      jest
        .spyOn(urlRepository, 'findOne')
        .mockResolvedValue(mockExistingUrlEntity);

      const result = await urlCreateService.shortUrl(urlData);

      expect(result).toEqual(
        `${process.env.BASE_URL}/url/${mockExistingUrlEntity.shortUrl}`,
      );
    });

    it('should retry generating a new short URL if the generated short URL already exists in the database', async () => {
      jest.spyOn(authRepository, 'findOne').mockResolvedValue(userData);
      jest
        .spyOn(urlRepository, 'findOne')
        .mockResolvedValueOnce(mockExistingUrlEntity)
        .mockResolvedValueOnce(null);
      jest.spyOn(urlRepository, 'create').mockReturnValue(mockNewUrlEntity);
      jest.spyOn(urlRepository, 'save').mockResolvedValue(mockNewUrlEntity);

      const result = await urlCreateService.shortUrl(urlData);

      expect(result).toEqual(
        `${process.env.BASE_URL}/url/${mockNewUrlEntity.shortUrl}`,
      );
    });

    it('should return error message if user not found', async () => {
      jest.spyOn(authRepository, 'findOne').mockResolvedValue(null);
      const result = await urlCreateService.shortUrl(urlData);
      expect(result).toEqual({ error: 'User not found' });
    });
  });

  //to write test for deleteExpiredUrls function
});
