import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { CreateParticipationDto, ParticipationDto } from '@rwa/shared';
import { ConfigService } from '../../../global/services/config/config.service';

@Injectable({
  providedIn: 'root',
})
export class ParticipationService {
  constructor(private http: HttpClient, private configService: ConfigService) {}

  getMyParticipations() {
    return this.http.get<ParticipationDto[]>(
      `${this.configService.getBackendBaseURL()}/participations/user/me`
    );
  }

  createParticipation(dto: CreateParticipationDto) {
    return this.http.post<ParticipationDto>(
      `${this.configService.getBackendBaseURL()}/participations`,
      dto
    );
  }

  deleteParticipation(participationId: number) {
    return this.http.delete(
      `${this.configService.getBackendBaseURL()}/participations/${participationId}`
    );
  }

  markSeen(participationId: number) {
    return this.http.patch(
      `${this.configService.getBackendBaseURL()}/participations/${participationId}/seen`,
      {}
    );
  }

  rejectParticipation(participationId: number) {
    return this.http.patch(
      `${this.configService.getBackendBaseURL()}/participations/${participationId}/reject`,
      {}
    );
  }
}
