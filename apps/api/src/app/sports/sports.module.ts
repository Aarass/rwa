import { Module } from '@nestjs/common';
import { SportsService } from './sports.service';
import { SportsController } from './sports.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Sport } from '@rwa/entities';
import { ImagesModule } from '../images/images.module';

@Module({
  imports: [TypeOrmModule.forFeature([Sport]), ImagesModule],
  controllers: [SportsController],
  providers: [SportsService],
})
export class SportsModule {}
