import {Injectable, NestMiddleware} from '@nestjs/common';
import{JwtService} from '@nestjs/jwt';
import {Request, Response, NextFunction} from 'express';

@Injectable()
export class AuthMiddleware implements NestMiddleware{
    constructor(private readonly jwtService:JwtService){}

    async use(req:Request, res:Response, next:NextFunction){
        const authHeader = req.headers.authorization;

        if(!authHeader){
            return res.status(401).json({message:"Unauthorized"});
        }

        const token = authHeader.split(' ')[1];
        try{
            const decoded = await this.jwtService.verifyAsync(token, {secret:process.env.JWT_SECRET});
            const username = decoded?.username;

            if(username !== req.body.username){
                return res.status(403).json({message:"Forbidden"});
            }
            next();
        }
        catch(err){
            return res.status(401).json({message:"Invalid token"});
        }
    }
}