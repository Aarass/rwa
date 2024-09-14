import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { CreateSurfaceDto, SurfaceDto } from '@rwa/shared';
import { ConfigService } from '../../../global/services/config/config.service';

@Injectable({
  providedIn: 'root',
})
export class SurfaceService {
  constructor(private http: HttpClient, private configService: ConfigService) {}

  getAllSurfaces() {
    return this.http.get<SurfaceDto[]>(
      `${this.configService.getBackendBaseURL()}/surfaces`
    );
  }

  createSurface(dto: CreateSurfaceDto) {
    return this.http.post<SurfaceDto>(
      `${this.configService.getBackendBaseURL()}/surfaces`,
      dto
    );
  }

  updateSurface(id: number, dto: CreateSurfaceDto) {
    return this.http.patch(
      `${this.configService.getBackendBaseURL()}/surfaces/${id}`,
      dto
    );
  }

  deleteSurface(id: number) {
    return this.http.delete(
      `${this.configService.getBackendBaseURL()}/surfaces/${id}`
    );
  }
}
