import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Post,
} from '@nestjs/common';
import { CreateRatingDto, TokenUser } from '@rwa/shared';
import { Public } from '../auth/decorators/public.decorator';
import { ExtractUser } from '../auth/decorators/user.decorator';
import { RatingsService } from './ratings.service';

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
    return await this.ratingsService.getStats(id);
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
