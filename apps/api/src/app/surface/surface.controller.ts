import { Body, Controller, Post } from '@nestjs/common';
import { CreateSurfaceDto, createSurfaceSchema } from '@rwa/shared';
import { ZodValidationPipe } from '../global/validation';
import { SurfaceService } from './surface.service';

@Controller('surfaces')
export class SurfaceController {
  constructor(private surfaceService: SurfaceService) {}

  @Post()
  async createSurface(
    @Body(new ZodValidationPipe(createSurfaceSchema))
    newSurface: CreateSurfaceDto
  ) {
    return await this.surfaceService.createSurface(newSurface.name);
  }
}
