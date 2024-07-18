import {
  Body,
  Controller,
  Delete,
  Get,
  NotFoundException,
  Param,
  ParseIntPipe,
  Post,
} from '@nestjs/common';
import { CreateSportDto, createSportSchema } from '@rwa/shared';
import { ZodValidationPipe } from '../global/validation';
import { SportsService } from './sports.service';

@Controller('sports')
export class SportsController {
  constructor(private readonly sportsService: SportsService) {}

  @Post()
  async create(
    @Body(new ZodValidationPipe(createSportSchema))
    createSportDto: CreateSportDto
  ) {
    return await this.sportsService.create(createSportDto);
  }

  @Get()
  async findAll() {
    return await this.sportsService.findAll();
  }

  @Get(':id')
  async findOne(@Param('id', ParseIntPipe) id: number) {
    const sport = await this.sportsService.findOne(id);

    if (sport == null) {
      throw new NotFoundException();
    }

    return sport;
  }

  @Delete(':id')
  async remove(@Param('id', ParseIntPipe) id: number) {
    await this.sportsService.remove(id);
  }
}
