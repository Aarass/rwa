import { ForbiddenException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CreateSurfaceDto, UpdateSurfaceDto } from '@rwa/shared';
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

  async update(id: number, dto: UpdateSurfaceDto) {
    return await this.surfaceRepository.update(id, dto);
  }

  async findAll() {
    return await this.surfaceRepository.find({
      order: {
        id: 'asc',
      },
    });
  }

  async findOne(id: number) {
    return await this.surfaceRepository.findOneBy({ id });
  }

  async remove(id: number) {
    try {
      return await this.surfaceRepository.delete({ id });
    } catch (err) {
      if ((err as Error & { code: string }).code === '23503') {
        throw new ForbiddenException('This surface is already in use');
      } else {
        throw err;
      }
    }
  }
}
