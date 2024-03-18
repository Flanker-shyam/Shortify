import { Test } from '@nestjs/testing';
import { BadRequestException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Repository, QueryFailedError } from 'typeorm';
import { AuthEntity } from '../auth.entity';
import { AuthService } from '../auth.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { RegisterDto, LoginDto, LoginResponseDto } from '../auth.dto';

describe('AuthService', () => {
  let authService: AuthService;
  let authRepository: Repository<AuthEntity>;

  const testUser: RegisterDto = {
    name: 'flanker',
    username: 'flanker1234@gmail.com',
    password: 'Flanker@1234',
  };
  const mockUser: AuthEntity = {
    name: 'flanker',
    username: 'flanker1234@gmail.com',
    password: 'Flanker@1234',
    id: 1,
    createdAt: new Date(),
    updatedAt: new Date(),
    urls: [],
  };

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      providers: [
        AuthService,
        {
          provide: getRepositoryToken(AuthEntity),
          useClass: Repository,
        },
        JwtService,
      ],
    }).compile();

    authService = module.get<AuthService>(AuthService);
    authRepository = module.get<Repository<AuthEntity>>(
      getRepositoryToken(AuthEntity),
    );
  });

  describe('registerUser', () => {
    it('should save the valid user into the DB', async () => {
      jest.spyOn(authRepository, 'create').mockReturnValue(mockUser);
      jest.spyOn(authRepository, 'save').mockResolvedValue(mockUser);
      const result = await authService.registerUser(testUser);
      expect(result).toEqual(mockUser);
    });

    it('should throw BadRequestException for duplicate username', async () => {
      const duplicateUserError = new QueryFailedError(
        'query failed',
        [],
        new Error('duplicate key value violates unique constraint'),
      );
      jest.spyOn(authRepository, 'create').mockReturnValue(mockUser);
      jest.spyOn(authRepository, 'save').mockRejectedValue(duplicateUserError);

      await expect(authService.registerUser(testUser)).rejects.toThrowError(
        BadRequestException,
      );
    });
  });
});
