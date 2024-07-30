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
import { CreateSurfaceDto, createSurfaceSchema } from '@rwa/shared';
import { SurfacesService } from './surfaces.service';
import { Roles } from '../auth/decorators/roles.decorator';
import { Public } from '../auth/decorators/public.decorator';
import { ZodValidationPipe } from '../global/validation';
@Controller('surfaces')
export class SurfacesController {
  constructor(private readonly surfacesService: SurfacesService) {}

  @Roles(['admin'])
  @Post()
  async create(
    @Body(new ZodValidationPipe(createSurfaceSchema))
    createSurfaceDto: CreateSurfaceDto
  ) {
    return this.surfacesService.create(createSurfaceDto);
  }

  @Public()
  @Get()
  async findAll() {
    return this.surfacesService.findAll();
  }

  @Public()
  @Get(':id')
  async findOne(@Param('id', ParseIntPipe) id: number) {
    const surface = await this.surfacesService.findOne(id);

    if (surface == null) {
      throw new NotFoundException('The surface does not exist');
    }

    return surface;
  }

  @Roles(['admin'])
  @Delete(':id')
  async remove(@Param('id', ParseIntPipe) id: number) {
    return this.surfacesService.remove(id);
  }
}
