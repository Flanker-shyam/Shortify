import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { NotFoundExceptionFilter } from './filters/not-found-exception.fllter';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import * as csurf from 'csurf';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.useGlobalFilters(new NotFoundExceptionFilter());
  app.enableCors();
  app.use(
    helmet(),
    rateLimit({
      windowMs: 15 * 60 * 1000,
      max: 100,
    }),
  );
  await app.listen(3001);
}
bootstrap();
