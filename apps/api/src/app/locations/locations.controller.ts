import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Query,
} from '@nestjs/common';
import { CreateLocationDto, createLocationSchema } from '@rwa/shared';
import { Public } from '../auth/decorators/public.decorator';
import { Roles } from '../auth/decorators/roles.decorator';
import { ZodValidationPipe } from '../global/validation';
import { LocationsService } from './locations.service';

@Controller('locations')
export class LocationsController {
  constructor(private readonly locationsService: LocationsService) {}

  @Roles(['admin'])
  @Post()
  async create(
    @Body(new ZodValidationPipe(createLocationSchema))
    createLocationDto: CreateLocationDto
  ) {
    return await this.locationsService.searchOnGoogleAndSave(
      createLocationDto.locationId
    );
  }

  @Public()
  @Get('/suggestion')
  async suggest(
    @Query('input')
    input: string
  ) {
    return await this.locationsService.suggest(input);
  }

  @Public()
  @Get()
  findAll() {
    return this.locationsService.findAll();
  }

  @Public()
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.locationsService.findOne(id);
  }

  @Roles(['admin'])
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.locationsService.remove(id);
  }
}
