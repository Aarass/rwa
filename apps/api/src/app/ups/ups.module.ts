import { Module } from '@nestjs/common';
import { UpsController } from './ups.controller';
import { UpsService } from './ups.service';

@Module({
  controllers: [UpsController],
  providers: [UpsService]
})
export class UpsModule { }
