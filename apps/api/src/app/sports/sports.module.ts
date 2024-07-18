import { Module } from '@nestjs/common';
import { SportsService } from './sports.service';
import { SportsController } from './sports.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Sport } from '../../entities/sport';

@Module({
  imports: [TypeOrmModule.forFeature([Sport])],
  controllers: [SportsController],
  providers: [SportsService],
})
export class SportsModule {}
