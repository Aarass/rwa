import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Rating } from '@rwa/entities';
import { CreateRatingDto } from '@rwa/shared';
import { Repository } from 'typeorm';

@Injectable()
export class RatingsService {
  constructor(
    @InjectRepository(Rating) private ratingRepository: Repository<Rating>
  ) {}

  async findOne(userRatedId: number, userRatingId: number) {
    return await this.ratingRepository.findOne({
      where: {
        userRated: {
          id: userRatedId,
        },
        userRating: {
          id: userRatingId,
        },
      },
    });
  }

  async getStats(id: number) {
    return (await this.ratingRepository
      .createQueryBuilder()
      .where({
        userRated: {
          id,
        },
      })
      .select(`AVG(value)::float, COUNT(*)::float`)
      .getRawOne()) as {
      avg: number;
      coutn: number;
    };
  }

  async create(createRatingDto: CreateRatingDto) {
    const res = await this.ratingRepository.upsert(
      {
        userRated: {
          id: createRatingDto.userRatedId,
        },
        userRating: {
          id: createRatingDto.userRatingId,
        },
        value: createRatingDto.value,
      },
      ['userRated', 'userRating']
    );
    return {
      id: res.identifiers[0].id,
    };
  }

  async remove(id: number) {
    await this.ratingRepository.delete(id);
  }
}
