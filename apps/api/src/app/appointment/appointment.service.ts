import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CreateAppointmentDto } from '@rwa/shared';
import { Repository } from 'typeorm';
import { Appointment } from '../../entities/appointment';

@Injectable()
export class AppointmentService {
  constructor(
    @InjectRepository(Appointment) private appointmentRepository: Repository<Appointment>
  ) { }

  async createAppointment(userId: number, newAppointment: CreateAppointmentDto) {
    const appointment = this.appointmentRepository.create({
      ...newAppointment,
      participants: [],
      organizerId: userId,
      canceled: false,
    });
    try {
      await this.appointmentRepository.save(appointment);
    } catch {
      return new BadRequestException();
    }

    return appointment;
  }
}
