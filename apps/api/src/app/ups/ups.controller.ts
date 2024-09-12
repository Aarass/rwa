import {
  Body,
  Controller,
  Delete,
  Get,
  NotFoundException,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  UnauthorizedException,
} from '@nestjs/common';
import {
  CreateUpsDto,
  createUpsSchema,
  TokenUser,
  UpdateUpsDto,
  updateUpsSchema,
} from '@rwa/shared';
import { Public } from '../auth/decorators/public.decorator';
import { ExtractUser } from '../auth/decorators/user.decorator';
import { ZodValidationPipe } from '../global/validation';
import { UpsService } from './ups.service';

@Controller('ups')
export class UpsController {
  constructor(private upsService: UpsService) {}

  @Get('user/me')
  getMySports(@ExtractUser() user: TokenUser) {
    return this.upsService.getUserSports(user.id);
  }

  @Public()
  @Get('user/:id')
  getUserSports(@Param('id', ParseIntPipe) id: number) {
    return this.upsService.getUserSports(id);
  }

  @Post('')
  async addSportToUser(
    @ExtractUser() user: TokenUser,
    @Body(new ZodValidationPipe(createUpsSchema))
    upsDto: CreateUpsDto
  ) {
    return await this.upsService.addSportToUser(user.id, upsDto);
  }

  @Patch(':id')
  async updateSelfRating(
    @ExtractUser() user: TokenUser,
    @Param('id', ParseIntPipe) id: number,
    @Body(new ZodValidationPipe(updateUpsSchema))
    updateDto: UpdateUpsDto
  ) {
    return await this.upsService.updateUps(id, updateDto);
  }

  @Delete(':id')
  async removeSportFromUser(
    @ExtractUser() user: TokenUser,
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
