import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, QueryFailedError } from 'typeorm';
import { AuthEntity } from './auth.entity';
import { RegisterDto, LoginDto, LoginResponseDto } from './auth.dto';
import { JwtService } from '@nestjs/jwt';
import { plainToClass } from 'class-transformer';
import { validate } from 'class-validator';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(AuthEntity)
    private authEntityRepository: Repository<AuthEntity>,
    private jwtService: JwtService,
  ) {}

  async generateToken(userData: LoginDto): Promise<string> {
    const payload = { username: userData.username };
    return this.jwtService.sign(payload);
  }

  async registerUser(userData: RegisterDto): Promise<AuthEntity | any> {
    const userDataObject = plainToClass(RegisterDto, userData);
    const errors = await validate(userDataObject);

    if (errors.length > 0) {
      const errorMessages = errors
        .map((error) => Object.values(error.constraints))
        .join('; ');
      throw new BadRequestException(errorMessages);
    }
    try {
      const newUser = this.authEntityRepository.create(userData);
      const savedUser = await this.authEntityRepository.save(newUser);
      return savedUser;
    } catch (error) {
      if (error instanceof QueryFailedError) {
        if (
          error.message.includes(
            'duplicate key value violates unique constraint',
          )
        ) {
          throw new BadRequestException('Username is already taken');
        }
      }
      throw new BadRequestException(error.message);
    }
  }

  async loginUser(
    userData: LoginDto,
  ): Promise<LoginResponseDto | string | { error: string }> {
    try {
      const userDataObject = plainToClass(LoginDto, userData);
      const errors = await validate(userDataObject);

      if (errors.length > 0) {
        const errorMessages = errors
          .map((error) => Object.values(error.constraints))
          .join('; ');
        throw new BadRequestException(errorMessages);
      }

      const user = await this.authEntityRepository.findOne({
        where: { username: userData.username },
      });
      if (user) {
        if (user.password === userData.password) {
          const token = await this.generateToken(user);
          return { user, token };
        } else {
          return 'Password is incorrect';
        }
      } else {
        return 'User not found';
      }
    } catch (err) {
      return { error: err.message };
    }
  }
}
