import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { CreateRatingDto, RatingDto, RatingStatsDto } from '@rwa/shared';

@Injectable({
  providedIn: 'root',
})
export class RatingService {
  constructor(private http: HttpClient) {}

  getStats(ratedUserId: number) {
    return this.http.get<RatingStatsDto>(
      `http://localhost:3000/ratings/stats/user/${ratedUserId}`
    );
  }

  getMyRating(ratedUserId: number) {
    return this.http.get<RatingDto | null>(
      `http://localhost:3000/ratings/user/${ratedUserId}`
    );
  }

  postRating(dto: CreateRatingDto) {
    return this.http.post<{ id: number }>(`http://localhost:3000/ratings`, dto);
  }

  deleteRating(id: number) {
    return this.http.delete(`http://localhost:3000/ratings/${id}`);
  }
}
