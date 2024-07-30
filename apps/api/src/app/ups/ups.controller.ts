import {
  BadRequestException,
  Body,
  Controller,
  Delete,
  Get,
  NotFoundException,
  Param,
  ParseIntPipe,
  Post,
  UnauthorizedException,
} from '@nestjs/common';
import { User } from '@rwa/shared';
import { Public } from '../auth/decorators/public.decorator';
import { ExtractUser } from '../auth/decorators/user.decorator';
import { ZodValidationPipe } from '../global/validation';
import { UpsService } from './ups.service';
import { CreateUpsDto, createUpsSchema } from '@rwa/shared';

@Controller('ups')
export class UpsController {
  constructor(private upsService: UpsService) {}

  @Get('user/me')
  getMySports(@ExtractUser() user: User) {
    return this.upsService.getUserSports(user.id);
  }

  @Public()
  @Get('user/:id')
  getUserSports(@Param('id', ParseIntPipe) id: number) {
    return this.upsService.getUserSports(id);
  }

  @Post('')
  async addSportToUser(
    @ExtractUser() user: User,
    @Body(new ZodValidationPipe(createUpsSchema))
    upsDto: CreateUpsDto
  ) {
    return await this.upsService.addSportToUser(user.id, upsDto);
  }

  @Delete(':id')
  async removeSportFromUser(
    @ExtractUser() user: User,
    @Param('id', ParseIntPipe) id: number
  ) {
    const ups = await this.upsService.getUps(id);

    if (ups == null) {
      throw new NotFoundException('Ups does not exist');
    }

    if (ups.userId != user.id) {
      throw new UnauthorizedException(`Can't delete others ups`);
    }

    return await this.upsService.removeSportFromUser(id);
  }
}
