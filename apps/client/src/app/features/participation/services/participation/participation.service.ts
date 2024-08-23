import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { CreateParticipationDto, ParticipationDto } from '@rwa/shared';

@Injectable({
  providedIn: 'root',
})
export class ParticipationService {
  constructor(private http: HttpClient) {}

  getMyParticipations() {
    return this.http.get<ParticipationDto[]>(
      'http://localhost:3000/participations/user/me'
    );
  }

  createParticipation(dto: CreateParticipationDto) {
    return this.http.post<ParticipationDto>(
      'http://localhost:3000/participations',
      dto
    );
  }

  deleteParticipation(participationId: number) {
    return this.http.delete(
      `http://localhost:3000/participations/${participationId}`
    );
  }

  markSeen(participationId: number): any {
    return this.http.patch(
      `http://localhost:3000/participations/${participationId}/seen`,
      {}
    );
  }

  rejectParticipation(participationId: number) {
    return this.http.patch(
      `http://localhost:3000/participations/${participationId}/reject`,
      {}
    );
  }
}
