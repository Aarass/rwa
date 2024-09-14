import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { CreateRatingDto, RatingDto, RatingStatsDto } from '@rwa/shared';
import { ConfigService } from '../../../global/services/config/config.service';

@Injectable({
  providedIn: 'root',
})
export class RatingService {
  constructor(private http: HttpClient, private configService: ConfigService) {}

  getStats(ratedUserId: number) {
    return this.http.get<RatingStatsDto>(
      `${this.configService.getBackendBaseURL()}/ratings/stats/user/${ratedUserId}`
    );
  }

  getMyRating(ratedUserId: number) {
    return this.http.get<RatingDto | null>(
      `${this.configService.getBackendBaseURL()}/ratings/user/${ratedUserId}`
    );
  }

  postRating(dto: CreateRatingDto) {
    return this.http.post<{ id: number }>(
      `${this.configService.getBackendBaseURL()}/ratings`,
      dto
    );
  }

  deleteRating(id: number) {
    return this.http.delete(
      `${this.configService.getBackendBaseURL()}/ratings/${id}`
    );
  }
}
