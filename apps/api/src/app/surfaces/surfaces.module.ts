import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Surface } from '../../entities/surface';
import { SurfacesController } from './surfaces.controller';
import { SurfacesService } from './surfaces.service';

@Module({
  imports: [TypeOrmModule.forFeature([Surface])],
  controllers: [SurfacesController],
  providers: [SurfacesService],
})
export class SurfacesModule {}
