import {
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
  CreateSurfaceDto,
  createSurfaceSchema,
  UpdateSurfaceDto,
  updateSurfaceSchema,
} from '@rwa/shared';
import { Public } from '../auth/decorators/public.decorator';
import { Roles } from '../auth/decorators/roles.decorator';
import { ZodValidationPipe } from '../global/validation';
import { SurfacesService } from './surfaces.service';
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

  @Roles(['admin'])
  @Patch(':id')
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body(new ZodValidationPipe(updateSurfaceSchema))
    updateSurfaceDto: UpdateSurfaceDto
  ) {
    return await this.surfacesService.update(id, updateSurfaceDto);
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
