import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { CreateUpsDto, UpdateUpsDto, UpsDto } from '@rwa/shared';
import { ConfigService } from '../../../global/services/config/config.service';

@Injectable({
  providedIn: 'root',
})
export class UpsService {
  constructor(private http: HttpClient, private configService: ConfigService) {}

  getMyUpses() {
    return this.http.get<UpsDto[]>(
      `${this.configService.getBackendBaseURL()}/ups/user/me`
    );
  }

  createUps(dto: CreateUpsDto) {
    return this.http.post<UpsDto>(
      `${this.configService.getBackendBaseURL()}/ups`,
      dto
    );
  }

  updateUps(id: number, dto: UpdateUpsDto) {
    return this.http.patch(
      `${this.configService.getBackendBaseURL()}/ups/${id}`,
      dto
    );
  }

  deleteUps(id: number) {
    return this.http.delete(
      `${this.configService.getBackendBaseURL()}/ups/${id}`
    );
  }
}
