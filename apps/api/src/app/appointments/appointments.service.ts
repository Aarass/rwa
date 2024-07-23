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
import { LocationsService } from '../locations/locations.service';

@Injectable()
export class AppointmentsService {
  constructor(
    @InjectRepository(Appointment)
    private appointmentRepository: Repository<Appointment>,
    @InjectRepository(Participation)
    private participationRepository: Repository<Participation>,
    private locationService: LocationsService
  ) {}

  async create(userId: number, newAppointment: CreateAppointmentDto) {
    let location = await this.locationService.findOne(
      newAppointment.locationId
    );

    if (location == null) {
      console.log('Prvi put vidim ovu lokaciju, potrazicu na google-u...');
      location = await this.locationService.create(newAppointment.locationId);

      if (location == null) {
        throw new BadRequestException();
      }
    }

    console.log(location);

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
      console.error(err);
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
    return await this.appointmentRepository.find({
      relations: ['participants'],
    });
  }

  async findOne(id: number) {
    return await this.appointmentRepository.findOne({
      where: { id },
      relations: ['participants'],
    });
  }

  async update(id: number, updateAppointmentDto: UpdateAppointmentDto) {
    const res = await this.appointmentRepository.update(
      id,
      updateAppointmentDto
    );

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
