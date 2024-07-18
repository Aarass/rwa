import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CreateAppointmentDto } from '@rwa/shared';
import { Repository } from 'typeorm';
import { Appointment } from '../../entities/appointment';

@Injectable()
export class AppointmentsService {
  constructor(
    @InjectRepository(Appointment)
    private appointmentRepository: Repository<Appointment>
  ) {}

  async create(userId: number, newAppointment: CreateAppointmentDto) {
    const appointment = this.appointmentRepository.create({
      ...newAppointment,
      participants: [],
      organizerId: userId,
      canceled: false,
    });

    try {
      const wid = await this.appointmentRepository.save(appointment);
      return await this.appointmentRepository.findOneBy({ id: wid.id });
    } catch (err: any) {
      if (err.code != undefined && err.code == 23503) {
        console.error('foreign_key_violation');
      }
      throw new BadRequestException();
    }
  }

  async findAll() {
    return await this.appointmentRepository.find();
  }

  async findOne(id: number) {
    return await this.appointmentRepository.findOneBy({ id });
  }

  async remove(id: number) {
    return await this.appointmentRepository.delete({ id });
  }
}
