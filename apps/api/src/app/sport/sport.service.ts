import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Sport } from '../../entities/sport';

@Injectable()
export class SportService {
  constructor(
    @InjectRepository(Sport) private sportRepository: Repository<Sport>,
  ) { }

  async createSport(name: string, iconUrl: string) {
    const sport = this.sportRepository.create({
      name,
      iconUrl
    });

    return await this.sportRepository.save(sport);
  }

  async getAllSports() {
    return await this.sportRepository.find();
  }
}
