import {Controller, Get, Post, Body} from '@nestjs/common';
import {AuthService} from './auth.service';
import {RegisterDto, LoginDto} from './auth.dto';

@Controller('auth')
export class AuthController{
    constructor(private readonly authService:AuthService){}

    @Post('register')
    async registerUser(@Body() userData:RegisterDto): Promise<any>{
        return this.authService.registerUser(userData);
    }

    @Post('login')
    async loginUser(@Body() userData:LoginDto): Promise<any>{
        return this.authService.loginUser(userData);
    }
}