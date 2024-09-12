import {
  BadRequestException,
  Body,
  Controller,
  Delete,
  Get,
  NotFoundException,
  Param,
  ParseIntPipe,
  Patch,
  Post,
} from '@nestjs/common';
import {
  CreateSportDto,
  createSportSchema,
  UpdateSportDto,
  updateSportSchema,
} from '@rwa/shared';
import { Public } from '../auth/decorators/public.decorator';
import { Roles } from '../auth/decorators/roles.decorator';
import { ZodValidationPipe } from '../global/validation';
import { ImagesService } from '../images/images.service';
import { SportsService } from './sports.service';

@Controller('sports')
export class SportsController {
  constructor(
    private sportsService: SportsService,
    private imagesService: ImagesService
  ) {}

  @Roles(['admin'])
  @Post()
  async create(
    @Body(new ZodValidationPipe(createSportSchema))
    createSportDto: CreateSportDto
  ) {
    return await this.sportsService.create(createSportDto);
  }

  @Roles(['admin'])
  @Patch(':id')
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body(new ZodValidationPipe(updateSportSchema))
    updateSportDto: UpdateSportDto
  ) {
    const sport = await this.sportsService.findOne(id);
    if (sport == null) {
      throw new BadRequestException(`Sport doesn't exist`);
    }

    if (updateSportDto.imageName) {
      if (this.imagesService.exists(sport.imageName)) {
        await this.imagesService.remove(sport.imageName);
      }
    }
    return await this.sportsService.update(id, updateSportDto);
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
      throw new NotFoundException('The sport does not exist');
    }

    return sport;
  }

  @Roles(['admin'])
  @Delete(':id')
  async remove(@Param('id', ParseIntPipe) id: number) {
    const sport = await this.sportsService.findOne(id);
    if (sport == null) {
      throw new NotFoundException();
    }

    if (this.imagesService.exists(sport.imageName)) {
      await this.imagesService.remove(sport.imageName);
    }

    await this.sportsService.remove(id);
  }
}
