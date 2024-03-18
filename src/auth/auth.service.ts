import { BadRequestException, Injectable, UnauthorizedException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, QueryFailedError } from 'typeorm';
import { AuthEntity } from './auth.entity';
import { RegisterDto, LoginDto, LoginResponseDto } from './auth.dto';
import { JwtService } from '@nestjs/jwt';
import {validateData} from '../helpers/validate';
@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(AuthEntity)
    private authEntityRepository: Repository<AuthEntity>,
    private jwtService: JwtService,
  ) {}

  async generateToken(userData: LoginDto): Promise<string> {
    const payload = { username: userData.username };
    return this.jwtService.signAsync(payload);
  }

  async registerUser(userData: RegisterDto): Promise<AuthEntity | any> {
    await validateData(userData, RegisterDto);
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
    await validateData(userData, LoginDto);
    try {
      const user = await this.authEntityRepository.findOne({
        where: { username: userData.username },
      });
      if (user) {
        if (user.password === userData.password) {
          const token = await this.generateToken(user);
          return { user, token };
        } else {
          throw new UnauthorizedException('Password is incorrect');
        }
      } else {
        throw new UnauthorizedException('User not found');
      }
    } catch (err) {
      return { error: err.message };
    }
  }
}
