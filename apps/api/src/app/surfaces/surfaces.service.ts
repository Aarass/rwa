import { ForbiddenException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CreateSurfaceDto } from '@rwa/shared';
import { Repository } from 'typeorm';
import { Surface } from '@rwa/entities';

@Injectable()
export class SurfacesService {
  constructor(
    @InjectRepository(Surface) private surfaceRepository: Repository<Surface>
  ) {}
  async create(createSurfaceDto: CreateSurfaceDto) {
    const newSurface = this.surfaceRepository.create(createSurfaceDto);
    return await this.surfaceRepository.save(newSurface);
  }
  async findAll() {
    return await this.surfaceRepository.find();
  }

  async findOne(id: number) {
    return await this.surfaceRepository.findOneBy({ id });
  }

  async remove(id: number) {
    try {
      return await this.surfaceRepository.delete({ id });
    } catch (err: any) {
      if (err.code == 23503) {
        throw new ForbiddenException(
          'This surface is already used in some appointment'
        );
      } else {
        throw err;
      }
    }
  }
}
