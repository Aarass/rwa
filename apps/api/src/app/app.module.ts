import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { APP_GUARD } from '@nestjs/core';
import { TypeOrmModule } from '@nestjs/typeorm';
import {
  Appointment,
  Location,
  Participation,
  Rating,
  Sport,
  Surface,
  User,
  UserPlaysSport,
} from '@rwa/entities';
import { AppointmentModule } from './appointments/appointments.module';
import { AuthModule } from './auth/auth.module';
import { JwtAuthGuard } from './auth/guards/jwt.guard';
import { RolesGuard } from './auth/guards/roles.guard';
import { ImagesModule } from './images/images.module';
import { LocationsModule } from './locations/locations.module';
import { ParticipationsModule } from './participations/participations.module';
import { RatingsModule } from './ratings/ratings.module';
import { SportsModule } from './sports/sports.module';
import { SurfacesModule } from './surfaces/surfaces.module';
import { UpsModule } from './ups/ups.module';
import { UserModule } from './user/user.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    (() => {
      console.log(process.env.DATABASE_HOST);
      console.log(process.env.DATABASE_USERNAME);
      console.log(process.env.DATABASE_PASSWORD);
      console.log(process.env.DATABASE_NAME);
      return TypeOrmModule.forRoot({
        type: 'postgres',
        host: process.env.DATABASE_HOST ?? 'localhost',
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
          Location,
        ],
        synchronize: true,
      });
    })(),
    AuthModule,
    UserModule,
    AppointmentModule,
    UpsModule,
    SportsModule,
    SurfacesModule,
    ParticipationsModule,
    LocationsModule,
    ImagesModule,
    RatingsModule,
  ],
  controllers: [],
  providers: [
    {
      provide: APP_GUARD,
      useClass: JwtAuthGuard,
    },
    {
      provide: APP_GUARD,
      useClass: RolesGuard,
    },
  ],
})
export class AppModule {}
