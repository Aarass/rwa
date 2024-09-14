import { Logger } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import cookieParser from 'cookie-parser';
import { AppModule } from './app/app.module';
import { GlobalInterceptor } from './app/global/global.interceptor';

// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { RolesGuard } from './app/auth/guards/roles.guard';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const port = process.env.PORT || 3000;
  app.use(cookieParser());
  app.enableCors({
    // origin: 'http://localhost:4200',
    origin: 'https://8fef-178-149-108-197.ngrok-free.app',
    credentials: true,
  });
  app.useGlobalInterceptors(new GlobalInterceptor());
  await app.listen(port);
  Logger.log(`🚀 Application is running on: http://localhost:${port}`);
}

bootstrap();
