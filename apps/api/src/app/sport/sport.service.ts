import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Sport } from '../../entities/sport';

@Injectable()
export class SportService {
  constructor(
    @InjectRepository(Sport) private sportRepository: Repository<Sport>,
  ) { }

  getAllSports() {
    return this.sportRepository.find();
  }
}
