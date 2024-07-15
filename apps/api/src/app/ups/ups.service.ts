import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UserPlaysSport } from '../../entities/user-plays-sport';

@Injectable()
export class UpsService {
  constructor(
    @InjectRepository(UserPlaysSport) private userPlaysSportRepository: Repository<UserPlaysSport>,
  ) { }

  async getUps(id: number) {
    return await this.userPlaysSportRepository.findOneBy({ id });
  }

  async getUserSports(id: number) {
    const sports = await this.userPlaysSportRepository.find({
      where: {
        user: {
          id: id
        }
      },
      select: ['id', 'sport', 'selfRatedSkillLevel'],
      relations: ['sport']
    });

    return sports;
  }

  async addSportToUser(sportId: number, userId: number, selfRating: number) {
    const ups = this.userPlaysSportRepository.create({
      user: { id: userId },
      sport: { id: sportId },
      selfRatedSkillLevel: selfRating
    });

    await this.userPlaysSportRepository.insert(ups);
    return ups;
  }

  async removeSportFromUser(upsId: number) {
    return await this.userPlaysSportRepository.delete(upsId);
  }
}
