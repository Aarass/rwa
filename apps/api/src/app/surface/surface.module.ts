import { Module } from '@nestjs/common';
import { SurfaceController } from './surface.controller';
import { SurfaceService } from './surface.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Surface } from '../../entities/surface';

@Module({
  imports: [TypeOrmModule.forFeature([Surface])],
  controllers: [SurfaceController],
  providers: [SurfaceService],
})
export class SurfaceModule { }
