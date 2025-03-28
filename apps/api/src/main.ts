import { Logger } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import cookieParser from 'cookie-parser';
import { AppModule } from './app/app.module';
import { GlobalInterceptor } from './app/global/global.interceptor';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const port = process.env.PORT || 3000;
  app.use(cookieParser());

  app.enableCors({
    origin: [
      new RegExp('http://localhost.*'),
      ...(process.env.ORIGIN ? [process.env.ORIGIN] : []),
    ],
    credentials: true,
  });
  app.useGlobalInterceptors(new GlobalInterceptor());
  await app.listen(port);

  Logger.log(`🚀 Application is running on: http://localhost:${port}`);
}

bootstrap();
