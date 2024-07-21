import {
  Body,
  Controller,
  Delete,
  Get,
  NotFoundException,
  Param,
  ParseIntPipe,
  Post,
  UseGuards,
} from '@nestjs/common';
import { CreateSportDto, createSportSchema } from '@rwa/shared';
import { ZodValidationPipe } from '../global/validation';
import { SportsService } from './sports.service';
import { Roles } from '../auth/decorators/roles.decorator';
import { RolesGuard } from '../auth/guards/roles.guard';
import { JwtAuthGuard } from '../auth/guards/jwt.guard';
import { Public } from '../auth/decorators/public.decorator';

@Controller('sports')
export class SportsController {
  constructor(private readonly sportsService: SportsService) {}

  @Roles(['admin'])
  @Post()
  async create(
    @Body(new ZodValidationPipe(createSportSchema))
    createSportDto: CreateSportDto
  ) {
    try {
      return await this.sportsService.create(createSportDto);
    } catch (err) {
      console.error(err);
      throw err;
    }
  }

  @Public()
  @Get()
  async findAll() {
    return await this.sportsService.findAll();
  }

  @Public()
  @Get(':id')
  async findOne(@Param('id', ParseIntPipe) id: number) {
    const sport = await this.sportsService.findOne(id);

    if (sport == null) {
      throw new NotFoundException();
    }

    return sport;
  }

  @Roles(['admin'])
  @Delete(':id')
  async remove(@Param('id', ParseIntPipe) id: number) {
    await this.sportsService.remove(id);
  }
}
