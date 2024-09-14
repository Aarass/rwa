import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { CreateSportDto, SportDto, UpdateSportDto } from '@rwa/shared';
import { ConfigService } from '../../../global/services/config/config.service';

@Injectable({
  providedIn: 'root',
})
export class SportService {
  constructor(private http: HttpClient, private configService: ConfigService) {}

  getAllSports() {
    return this.http.get<SportDto[]>(
      `${this.configService.getBackendBaseURL()}/sports`
    );
  }

  createSport(dto: CreateSportDto) {
    return this.http.post<SportDto>(
      `${this.configService.getBackendBaseURL()}/sports`,
      dto
    );
  }

  updateSport(id: number, dto: UpdateSportDto) {
    return this.http.patch(
      `${this.configService.getBackendBaseURL()}/sports/${id}`,
      dto
    );
  }

  deleteSport(id: number) {
    return this.http.delete(
      `${this.configService.getBackendBaseURL()}/sports/${id}`
    );
  }
}
