import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { APP_GUARD } from '@nestjs/core';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Appointment } from '@rwa/entities';
import { Participation } from '@rwa/entities';
import { Rating } from '@rwa/entities';
import { Sport } from '@rwa/entities';
import { Surface } from '@rwa/entities';
import { User } from '@rwa/entities';
import { UserPlaysSport } from '@rwa/entities';
import { Location } from '@rwa/entities';
import { AppointmentModule } from '../appointments/appointments.module';
import { AuthModule } from '../auth/auth.module';
import { JwtAuthGuard } from '../auth/guards/jwt.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { ParticipationsModule } from '../participations/participations.module';
import { SportsModule } from '../sports/sports.module';
import { SurfacesModule } from '../surfaces/surfaces.module';
import { UpsModule } from '../ups/ups.module';
import { UserModule } from '../user/user.module';
import { LocationsModule } from '../locations/locations.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    TypeOrmModule.forRootAsync({
      useFactory: async () => {
        await ConfigModule.envVariablesLoaded;
        return {
          type: 'postgres',
          host: 'localhost',
          port: 5432,
          username: process.env.DATABASE_USERNAME,
          password: process.env.DATABASE_PASSWORD,
          database: 'test_database',
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
          dropSchema: true,
        };
      },
    }),
    AuthModule,
    SportsModule,
    UserModule,
    AppointmentModule,
    UpsModule,
    SurfacesModule,
    ParticipationsModule,
    LocationsModule,
  ],
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
export class TestModule {}
