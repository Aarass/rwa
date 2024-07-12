import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserPlaysSport } from '../models/user-plays-sport';
import { SportController } from './sport.controller';
import { SportService } from './sport.service';
import { UpsController } from './ups.controller';
import { UpsService } from './ups.service';
import { Sport } from '../models/sport';

@Module({
        imports: [TypeOrmModule.forFeature([UserPlaysSport]), TypeOrmModule.forFeature([Sport])],
        controllers: [SportController, UpsController],
        providers: [UpsService, SportService],
})
export class SportModule { }
