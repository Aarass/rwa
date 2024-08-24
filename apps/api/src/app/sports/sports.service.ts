import { ForbiddenException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CreateSportDto } from '@rwa/shared';
import { Repository } from 'typeorm';
import { Sport } from '@rwa/entities';

@Injectable()
export class SportsService {
  constructor(
    @InjectRepository(Sport) private sportRepository: Repository<Sport>
  ) {}
  async create(createSportDto: CreateSportDto) {
    const sport = this.sportRepository.create(createSportDto);
    return await this.sportRepository.save(sport);
  }

  async findAll() {
    return await this.sportRepository.find();
  }

  async findOne(id: number) {
    return await this.sportRepository.findOneBy({ id });
  }

  async remove(id: number) {
    try {
      return await this.sportRepository.delete({ id });
    } catch (err: any) {
      if (err.code == 23503) {
        throw new ForbiddenException(
          'This sport is already used in some appointment'
        );
      } else {
        throw err;
      }
    }
  }
}
