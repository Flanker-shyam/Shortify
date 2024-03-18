import { Test } from '@nestjs/testing';
import { AuthController } from '../auth.controller';
import { AuthService } from '../auth.service';
import { Repository } from 'typeorm';
import { getRepositoryToken } from '@nestjs/typeorm';
import { AuthEntity } from '../auth.entity';
import { JwtService } from '@nestjs/jwt';
import { RegisterDto, LoginDto, LoginResponseDto } from '../auth.dto';

describe('AuthController', () => {
  let authController: AuthController;
  let authService: AuthService;

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      controllers: [AuthController],
      providers: [
        AuthService,
        {
          provide: getRepositoryToken(AuthEntity),
          useClass: Repository,
        },
        JwtService,
      ],
    }).compile();

    authController = module.get<AuthController>(AuthController);
    authService = module.get<AuthService>(AuthService);
  });

  describe('registerUser', () => {
    it('should register a user', async () => {
      const userData: RegisterDto = {
        name: 'flanker',
        username: 'flanker19589@gmail.com',
        password: 'Flanker@1916',
      };
      const registeredUser: AuthEntity = {
        name: 'flanker',
        username: 'flanker19589@gmail.com',
        password: 'Flanker@1916',
        id: 5,
        createdAt: new Date(),
        updatedAt: new Date(),
        urls: [],
      };
      jest.spyOn(authService, 'registerUser').mockResolvedValue(registeredUser);

      const result = await authController.registerUser(userData);

      expect(result).toEqual(registeredUser);
    });
  });

  describe('loginUser', () => {
    it('should login a user', async () => {
      const userData: LoginDto = {
        username: 'flanker19@gmail.com',
        password: 'Flanker@1916',
      };
      const loginResponse: LoginResponseDto = {
        user: {
          id: 1,
          name: 'flanker',
          username: 'flanker19@gmail.com',
          password: 'Flanker@1916',
          createdAt: new Date(),
          updatedAt: new Date(),
          urls: [],
        },
        token: 'abc123def456',
      };
      jest.spyOn(authService, 'loginUser').mockResolvedValue(loginResponse);

      const result = await authController.loginUser(userData);

      expect(result).toEqual(loginResponse);
    });
  });
});
