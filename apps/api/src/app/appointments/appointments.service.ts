import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import {
  AppointmentFilters,
  AppointmentsOrdering,
  CreateAppointmentDto,
  FindAppointmentsDto,
  UpdateAppointmentDto,
} from '@rwa/shared';
import { Entity, Repository, SelectQueryBuilder } from 'typeorm';
import { Appointment, Participation } from '@rwa/entities';
import { LocationsService } from '../locations/locations.service';
import { GeoPointDto } from 'shared/src/lib/Point';
import { assert } from 'console';

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
    await this.locationService.checkLocation(newAppointment.locationId);

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
        console.log(err);
        throw new BadRequestException(`Referenced object does not exist`);
      }
      console.error(err);
      throw new BadRequestException(`Unexpected error`);
    }
  }

  async findAll(criteria: FindAppointmentsDto) {
    let { filters, ordering, userLocation } = criteria;

    if (filters.skip == null) {
      filters.skip = 0;
    }

    if (filters.take == null) {
      filters.take = 10;
    }

    // const nulledFilters: {
    //   [K in keyof AppointmentFilters]-?: AppointmentFilters[K] | null;
    // } = {
    //   sportId: filters.sportId ?? null,
    //   age: filters.age ?? null,
    //   skill: filters.skill ?? null,
    //   minDate: filters.minDate ?? null,
    //   maxDate: filters.maxDate ?? null,
    //   minTime: filters.minTime ?? null,
    //   maxTime: filters.maxTime ?? null,
    //   maxPrice: filters.maxPrice ?? null,
    //   maxDistance: filters.maxDistance ?? null,
    //   organizerId: filters.organizerId ?? null,
    //   canceled: filters.canceled ?? null,
    //   skip: filters.skip ?? null,
    //   take: filters.take ?? null,
    // };

    let query = this.appointmentRepository
      .createQueryBuilder('appointment')
      .leftJoinAndSelect('appointment.sport', 'sport')
      .leftJoinAndSelect('appointment.surface', 'surface')
      .leftJoinAndSelect('appointment.location', 'location')
      .leftJoinAndSelect('appointment.participants', 'participants')
      .setParameters({
        ...filters,
      })
      .where(
        `appointment.sportId = COALESCE(:sportId, appointment.sportId) AND 
         appointment.minAge <= COALESCE(:age, appointment.minAge) AND 
         appointment.maxAge >= COALESCE(:age, appointment.maxAge) AND 
         appointment.minSkillLevel <= COALESCE(:skill, appointment.minSkillLevel) AND 
         appointment.maxSkillLevel >= COALESCE(:skill, appointment.maxSkillLevel) AND 
         appointment.date >= COALESCE(:minDate, appointment.date) AND 
         appointment.date <= COALESCE(:maxDate, appointment.date) AND 
         appointment.startTime >= COALESCE(:minTime, appointment.startTime) AND 
         appointment.startTime <= COALESCE(:maxTime, appointment.startTime) AND 
         appointment.pricePerPlayer <= COALESCE(:maxPrice, appointment.pricePerPlayer) AND 
         appointment.organizerId = COALESCE(:organizerId, appointment.organizerId) AND 
         appointment.canceled = COALESCE(:canceled, appointment.canceled)`
      )
      .skip(filters.skip)
      .take(filters.take);

    if (
      filters.maxDistance != null ||
      (ordering != null && ordering.by == 'distance')
    ) {
      if (userLocation == null) {
        throw new BadRequestException(
          `User must pass its location to filter or sort by distance`
        );
      }

      query.setParameters(userLocation);
    }

    if (filters.maxDistance != null) {
      query = query.andWhere(
        `SQRT(POW(69.1 * (lat::float -  :lat::float), 2) + POW(69.1 * (:lng::float - location.lng::float) * COS(location.lat::float / 57.3), 2)) <= (:maxDistance * 0.621371192)`
      );
    }

    if (ordering != null) {
      switch (ordering.by) {
        case 'distance':
          query = query
            .addSelect(
              `SQRT(POW(69.1 * (lat::float -  :lat::float), 2) + POW(69.1 * (:lng::float - location.lng::float) * COS(location.lat::float / 57.3), 2))`,
              'distance'
            )
            .orderBy('distance', ordering.direction);
          break;
        case 'date':
          query = query
            .orderBy('appointment.date', ordering.direction)
            .addOrderBy('appointment.startTime', ordering.direction);
          break;
        case 'price':
          query = query.orderBy(
            'appointment.pricePerPlayer',
            ordering.direction
          );
          break;
      }
    }

    return await query.getMany();
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
