import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CreateParticipationDto } from '@rwa/shared';
import { Participation } from '../../entities/participation';
import { Repository } from 'typeorm';

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
    await this.participationRepository.save(participation);
    return await this.participationRepository.findOne({
      where: { id: participation.id },
      relations: ['appointment'],
    });
  }

  async findAll() {
    return await this.participationRepository.find();
  }

  async findOne(id: number) {
    return await this.participationRepository.findOne({
      where: { id },
      relations: ['appointment'],
    });
  }

  async markSeen(id: number) {
    await this.participationRepository.update(id, {
      userHasSeenChanges: true,
    });
  }

  async reject(id: number) {
    await this.participationRepository.update(id, {
      approved: false,
    });
  }

  async remove(id: number) {
    await this.participationRepository.delete(id);
  }
}
