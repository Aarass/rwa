import { BadRequestException, Body, Controller, Delete, Get, NotFoundException, Param, ParseIntPipe, Post, UnauthorizedException, UseGuards, UsePipes } from '@nestjs/common';
import { AddSportToUserDto, addSportToUserSchema } from '@rwa/shared';
import { ExtractUser } from '../auth/decorators/user.decorator';
import { JwtAuthGuard } from '../auth/guards/jwt.guard';
import { ZodValidationPipe } from '../global/validation';
import { User } from '../models/user';
import { UpsService } from './ups.service';

@Controller('ups')
export class UpsController {
  constructor(
    private upsService: UpsService
  ) { }

  @Get('user/me')
  @UseGuards(JwtAuthGuard)
  getMySports(@ExtractUser() user: User) {
    return this.upsService.getUserSports(user.id);
  }

  @Get('user/:id')
  getUserSports(@Param('id', ParseIntPipe) id: number) {
    return this.upsService.getUserSports(id);
  }

  @Post('')
  @UseGuards(JwtAuthGuard)
  async addSportToUser(@Body(new ZodValidationPipe(addSportToUserSchema)) addSportToUserDto: AddSportToUserDto, @ExtractUser() user: User) {
    try {
      return await this.upsService.addSportToUser(addSportToUserDto.sportId, user.id, addSportToUserDto.selfRating);
    }
    catch (err) {
      if (err.code != undefined) {
        if (err.code == 23505) {
          console.log('Duplicate')
          throw new BadRequestException();
        }
      }
      console.log(typeof err);
      return err;
    }
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard)
  async removeSportFromUser(@ExtractUser() user: User, @Param('id') id: number) {
    const ups = await this.upsService.getUps(id);
    if (ups == null) {
      throw new NotFoundException();
    }

    if (ups.userId != user.id) {
      throw new UnauthorizedException();
    }

    return await this.upsService.removeSportFromUser(id);
  }
}
