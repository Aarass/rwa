import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  ParseIntPipe,
} from '@nestjs/common';
import { RatingsService } from './ratings.service';
import { CreateRatingDto } from '@rwa/shared';
import { Public } from '../auth/decorators/public.decorator';
import { ExtractUser } from '../auth/decorators/user.decorator';
import { User } from '@rwa/entities';
import { TokenUser } from '@rwa/shared';

@Controller('ratings')
export class RatingsController {
  constructor(private readonly ratingsService: RatingsService) {}

  @Get('user/:id')
  async getMyRating(
    @Param('id', ParseIntPipe) id: number,
    @ExtractUser() user: TokenUser
  ) {
    return await this.ratingsService.findOne(id, user.id);
  }

  @Public()
  @Get('stats/user/:id')
  async getStats(@Param('id', ParseIntPipe) id: number) {
    return ((await this.ratingsService.getStats(id)) as any)[0];
  }

  @Public()
  @Post()
  async create(@Body() createRatingDto: CreateRatingDto) {
    return await this.ratingsService.create(createRatingDto);
  }

  @Delete(':id')
  async remove(@Param('id', ParseIntPipe) id: number) {
    return await this.ratingsService.remove(id);
  }
}
