import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CreateParticipationDto } from '@rwa/shared';
import { Participation, User } from '@rwa/entities';
import { Repository } from 'typeorm';
import { date } from 'zod';

@Injectable()
export class ParticipationsService {
  constructor(
    @InjectRepository(Participation)
    private participationRepository: Repository<Participation>
  ) {}

  async create(userId: number, createParticipationDto: CreateParticipationDto) {
    const participation = this.participationRepository.create({
      ...createParticipationDto,
      userId,
    });
    await this.participationRepository.insert(participation);
    return await this.participationRepository.findOne({
      where: { id: participation.id },
      relations: ['appointment', 'user', 'user.location'],
    });
  }

  async findAll() {
    return await this.participationRepository.find();
  }

  async findMy(userId: number) {
    return await this.participationRepository.find({
      where: { userId },
      relations: ['appointment', 'appointment.sport'],
      order: {
        appointment: {
          date: 'DESC',
          startTime: 'DESC',
        },
      },
    });
  }

  async findOne(id: number) {
    return await this.participationRepository.findOne({
      where: { id },
      relations: ['appointment', 'user', 'user.location', 'appointment.sport'],
    });
  }

  // async findOneWithoutId(appointmentId: number, userId: number) {
  //   return await this.participationRepository.findOne({
  //     where: { appointmentId, userId },
  //     relations: ['appointment'],
  //   });
  // }

  async markSeen(id: number) {
    await this.participationRepository.update(id, {
      userHasSeenChanges: true,
    });
  }

  async reject(id: number) {
    await this.participationRepository.update(id, {
      approved: false,
      userHasSeenChanges: false,
    });
  }

  async remove(id: number) {
    await this.participationRepository.delete(id);
  }
}
