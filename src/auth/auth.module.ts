import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { AuthController } from "./auth.controller";
import { AuthService } from "./auth.service";
import { AuthEntity } from "./auth.entity";
import { JwtModule } from '@nestjs/jwt';

@Module({
    imports: [
        TypeOrmModule.forFeature([AuthEntity]), // Import and provide the AuthEntity to TypeOrmModule
        JwtModule.register({
            secret: 'flankerSecretKey', // Replace with your secret key
            signOptions: { expiresIn: '1h' }, // Token expiration (optional)
        }),
    ],
    controllers: [AuthController],
    providers: [AuthService], // Remove AuthEntity from providers
})
export class AuthModule {}
