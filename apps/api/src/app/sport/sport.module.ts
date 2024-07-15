import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SportController } from './sport.controller';
import { SportService } from './sport.service';
import { Sport } from '../../entities/sport';

@Module({
        imports: [TypeOrmModule.forFeature([Sport])],
        controllers: [SportController],
        providers: [SportService],
})
export class SportModule { }
