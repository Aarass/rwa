import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { typeOrmConfig } from '../../typeorm.config';
import { AuthModule } from './auth/auth.module';
import { SportModule } from './sport/sport.module';
import { UserModule } from './user/user.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    TypeOrmModule.forRoot(typeOrmConfig),
    AuthModule,
    SportModule,
    UserModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule { }
