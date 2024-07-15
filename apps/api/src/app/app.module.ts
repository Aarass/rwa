import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { typeOrmConfig } from '../../typeorm.config';
import { AuthModule } from './auth/auth.module';
import { SportModule } from './sport/sport.module';
import { UserModule } from './user/user.module';
import { AppointmentModule } from './appointment/appointment.module';
import { UpsModule } from './ups/ups.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    TypeOrmModule.forRoot(typeOrmConfig),
    AuthModule,
    SportModule,
    UserModule,
    AppointmentModule,
    UpsModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
