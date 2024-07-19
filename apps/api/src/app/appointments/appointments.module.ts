import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppointmentsController } from './appointments.controller';
import { AppointmentsService } from './appointments.service';
import { Appointment } from '../../entities/appointment';
import { Participation } from '../../entities/participation';

@Module({
  imports: [TypeOrmModule.forFeature([Appointment, Participation])],
  controllers: [AppointmentsController],
  providers: [AppointmentsService],
})
export class AppointmentModule {}
