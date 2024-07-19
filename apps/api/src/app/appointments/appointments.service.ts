import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import {
  AppointmentFilters,
  CreateAppointmentDto,
  UpdateAppointmentDto,
} from '@rwa/shared';
import { Repository } from 'typeorm';
import { Appointment } from '../../entities/appointment';
import { Participation } from '../../entities/participation';

@Injectable()
export class AppointmentsService {
  constructor(
    @InjectRepository(Appointment)
    private appointmentRepository: Repository<Appointment>,
    @InjectRepository(Participation)
    private participationRepository: Repository<Participation>
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

  async findWithFilters(filters: AppointmentFilters) {
    return await this.appointmentRepository.find({
      where: {
        canceled: filters.canceled,
      },
      relations: ['participants'],
    });
  }

  async findAll() {
    return await this.appointmentRepository.find();
  }

  async findOne(id: number) {
    return await this.appointmentRepository.findOneBy({ id });
  }

  async update(id: number, updateAppointmentDto: UpdateAppointmentDto) {
    console.log(updateAppointmentDto);
    const res = await this.appointmentRepository.update(
      id,
      updateAppointmentDto
    );

    console.log(res);
    return;

    await this.participationRepository.update(
      {
        appointmentId: id,
      },
      {
        userHasSeenChanges: false,
      }
    );
  }

  // Korisnik ce moci samo da otkaze termin, ne i da ga u potpunosti obrise
  // async remove(id: number) {
  //   return await this.appointmentRepository.delete({ id });
  // }

  async cancel(id: number) {
    await this.appointmentRepository.update(id, {
      canceled: true,
    });

    await this.participationRepository.update(
      {
        appointmentId: id,
      },
      {
        userHasSeenChanges: false,
      }
    );
  }
}
