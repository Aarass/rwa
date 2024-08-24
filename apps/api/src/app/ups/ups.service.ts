import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UserPlaysSport } from '@rwa/entities';
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

  async getUserSport(userId: number, sportId: number) {
    const ups = await this.userPlaysSportRepository.findOne({
      where: {
        user: {
          id: userId,
        },
        sport: {
          id: sportId,
        },
      },
      select: ['id', 'sport', 'selfRatedSkillLevel'],
      relations: ['sport'],
    });

    return ups;
  }

  async addSportToUser(userId: number, upsDto: CreateUpsDto) {
    const ups = this.userPlaysSportRepository.create({
      userId,
      ...upsDto,
    });

    try {
      await this.userPlaysSportRepository.save(ups);
      return await this.userPlaysSportRepository.findOne({
        where: { id: ups.id },
        relations: ['sport'],
      });
    } catch (err: any) {
      if (err.code != undefined) {
        if (err.code == 23505) {
          throw new BadRequestException('User already plays that sport');
        }
      }
      return err;
    }
  }

  async updateUps(id: number, updateDto: { selfRatedSkillLevel: number }) {
    return await this.userPlaysSportRepository.update(id, updateDto);
  }

  async removeSportFromUser(upsId: number) {
    return await this.userPlaysSportRepository.delete(upsId);
  }
}
