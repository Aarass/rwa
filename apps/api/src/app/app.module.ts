import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Appointment } from '../entities/appointment';
import { Participation } from '../entities/participation';
import { Rating } from '../entities/rating';
import { Sport } from '../entities/sport';
import { Surface } from '../entities/surface';
import { User } from '../entities/user';
import { UserPlaysSport } from '../entities/user-plays-sport';
import { AppointmentModule } from './appointment/appointment.module';
import { AuthModule } from './auth/auth.module';
import { SportModule } from './sport/sport.module';
import { SurfaceModule } from './surface/surface.module';
import { TestModule } from './test/test.module';
import { UpsModule } from './ups/ups.module';
import { UserModule } from './user/user.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: 'localhost',
      port: 5432,
      username: process.env.DATABASE_USERNAME,
      password: process.env.DATABASE_PASSWORD,
      database: process.env.DATABASE_NAME,
      entities: [
        User,
        Appointment,
        UserPlaysSport,
        Rating,
        Participation,
        Sport,
        Surface,
      ],
      synchronize: true,
    }),
    AuthModule,
    SportModule,
    UserModule,
    AppointmentModule,
    UpsModule,
    SurfaceModule,
    TestModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
