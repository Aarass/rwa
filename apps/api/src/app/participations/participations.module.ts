import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Participation } from '../../entities/participation';
import { AppointmentModule } from '../appointments/appointments.module';
import { ParticipationsController } from './participations.controller';
import { ParticipationsService } from './participations.service';
import { UpsModule } from '../ups/ups.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Participation]),
    AppointmentModule,
    UpsModule,
  ],
  controllers: [ParticipationsController],
  providers: [ParticipationsService],
})
export class ParticipationsModule {}
