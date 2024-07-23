import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  ParseIntPipe,
} from '@nestjs/common';
import { LocationsService } from './locations.service';
import {
  CreateLocationDto,
  createLocationSchema,
  GetSuggestLocationDto,
  getSuggestionLocationSchema,
} from '@rwa/shared';
import { Roles } from '../auth/decorators/roles.decorator';
import { ZodValidationPipe } from '../global/validation';
import { Public } from '../auth/decorators/public.decorator';

@Controller('locations')
export class LocationsController {
  constructor(private readonly locationsService: LocationsService) {}

  @Roles(['admin'])
  @Post()
  async create(
    @Body(new ZodValidationPipe(createLocationSchema))
    createLocationDto: CreateLocationDto
  ) {
    return await this.locationsService.create(createLocationDto.locationId);
  }

  @Public()
  @Get('/suggestion')
  async suggest(
    @Body(new ZodValidationPipe(getSuggestionLocationSchema))
    dto: GetSuggestLocationDto
  ) {
    return await this.locationsService.suggest(dto.input);
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
