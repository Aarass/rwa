import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  ParseIntPipe,
  NotFoundException,
} from '@nestjs/common';
import { SurfacesService } from './surfaces.service';
import { CreateSurfaceDto } from '@rwa/shared';
@Controller('surfaces')
export class SurfacesController {
  constructor(private readonly surfacesService: SurfacesService) {}

  @Post()
  async create(
    @Body() createSurfaceDto: CreateSurfaceDto
  ): Promise<
    import('/home/aleksandar/Documents/source/rwa/apps/api/src/entities/surface').Surface
  > {
    return this.surfacesService.create(createSurfaceDto);
  }

  @Get()
  async findAll() {
    return this.surfacesService.findAll();
  }

  @Get(':id')
  async findOne(@Param('id', ParseIntPipe) id: number) {
    const surface = await this.surfacesService.findOne(id);

    if (surface == null) {
      throw new NotFoundException();
    }

    return surface;
  }

  @Delete(':id')
  async remove(@Param('id', ParseIntPipe) id: number) {
    return this.surfacesService.remove(id);
  }
}
