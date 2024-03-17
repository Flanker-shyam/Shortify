import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { NotFoundExceptionFilter } from './filters/not-found-exception.fllter';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.useGlobalFilters(new NotFoundExceptionFilter());
  await app.listen(3000);
}
bootstrap();
