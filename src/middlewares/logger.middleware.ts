import {Injectable, NestMiddleware} from '@nestjs/common';
import {Request, Response, NextFunction} from 'express';

@Injectable()
export class LoggerMiddleware implements NestMiddleware{
    async use(req:Request, res:Response, next:NextFunction){
        const path = req.originalUrl;
        const method = req.method;

        console.log(`Request path: ${path}, and method: ${method}`);
        next();
    }
}