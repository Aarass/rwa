import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Participation } from '@rwa/entities';
import { AppointmentModule } from '../appointments/appointments.module';
import { ParticipationsController } from './participations.controller';
import { ParticipationsService } from './participations.service';
import { UpsModule } from '../ups/ups.module';
import { UserModule } from '../user/user.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Participation]),
    AppointmentModule,
    UserModule,
    UpsModule,
  ],
  controllers: [ParticipationsController],
  providers: [ParticipationsService],
})
export class ParticipationsModule {}
