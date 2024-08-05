import { Module } from '@nestjs/common';
import { UpsController } from './ups.controller';
import { UpsService } from './ups.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserPlaysSport } from '@rwa/entities';

@Module({
  imports: [TypeOrmModule.forFeature([UserPlaysSport])],
  controllers: [UpsController],
  providers: [UpsService],
  exports: [UpsService],
})
export class UpsModule {}
