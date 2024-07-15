import { Body, Controller, Get, Post } from '@nestjs/common';
import { SportService } from './sport.service';
import { CreateSportDto, createSportSchema } from '@rwa/shared';
import { ZodValidationPipe } from '../global/validation';

@Controller('sports')
export class SportController {
  constructor(private sportService: SportService) { }

  @Get()
  async getAllSports() {
    return await this.sportService.getAllSports();
  }

  @Post()
  async createSport(@Body(new ZodValidationPipe(createSportSchema)) newSport: CreateSportDto) {
    return await this.sportService.createSport(newSport.name, newSport.iconUrl);
  }
}
