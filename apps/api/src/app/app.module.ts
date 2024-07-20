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
import { AppointmentModule } from './appointments/appointments.module';
import { AuthModule } from './auth/auth.module';
import { TestModule } from './test/test.module';
import { UpsModule } from './ups/ups.module';
import { UserModule } from './user/user.module';
import { SportsModule } from './sports/sports.module';
import { SurfacesModule } from './surfaces/surfaces.module';
import { ParticipationsModule } from './participations/participations.module';

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
    UserModule,
    AppointmentModule,
    UpsModule,
    TestModule,
    SportsModule,
    SurfacesModule,
    ParticipationsModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
