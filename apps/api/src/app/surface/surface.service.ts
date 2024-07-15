import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Surface } from '../../entities/surface';

@Injectable()
export class SurfaceService {
  constructor(@InjectRepository(Surface) private surfaceRepository: Repository<Surface>) { }

  async createSurface(name: string) {
    const newSurface = this.surfaceRepository.create({ name });
    const surface = await this.surfaceRepository.save(newSurface);
    return surface;
  }
}
