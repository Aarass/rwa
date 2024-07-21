import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UserPlaysSport } from '../../entities/user-plays-sport';
import { CreateUpsDto } from '@rwa/shared';

@Injectable()
export class UpsService {
  constructor(
    @InjectRepository(UserPlaysSport)
    private userPlaysSportRepository: Repository<UserPlaysSport>
  ) {}

  async getUps(id: number) {
    return await this.userPlaysSportRepository.findOneBy({ id });
  }

  async getUserSports(id: number) {
    const sports = await this.userPlaysSportRepository.find({
      where: {
        user: {
          id: id,
        },
      },
      select: ['id', 'sport', 'selfRatedSkillLevel'],
      relations: ['sport'],
    });

    return sports;
  }

  async addSportToUser(userId: number, upsDto: CreateUpsDto) {
    const ups = this.userPlaysSportRepository.create({
      userId,
      ...upsDto,
    });

    return await this.userPlaysSportRepository.save(ups);
  }

  async removeSportFromUser(upsId: number) {
    return await this.userPlaysSportRepository.delete(upsId);
  }
}
