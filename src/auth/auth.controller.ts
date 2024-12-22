import { Controller, Post, Body } from '@nestjs/common';
import { AuthService } from './auth.service';
import { RegisterDto, LoginDto } from './auth.dto';
import { AuthEntity } from './auth.entity';
import { LoginResponseDto } from './auth.dto';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('register')
  async registerUser(@Body() userData: RegisterDto): Promise<AuthEntity | any> {
    return this.authService.registerUser(userData);
  }

  @Post('login')
  async loginUser(
    @Body() userData: LoginDto,
  ): Promise<LoginResponseDto | string | { error: string }> {
    return this.authService.loginUser(userData);
  }
}
