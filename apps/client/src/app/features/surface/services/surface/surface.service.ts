import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { CreateSurfaceDto, SurfaceDto } from '@rwa/shared';

@Injectable({
  providedIn: 'root',
})
export class SurfaceService {
  constructor(private http: HttpClient) {}

  getAllSurfaces() {
    return this.http.get<SurfaceDto[]>('http://localhost:3000/surfaces');
  }

  createSurface(dto: CreateSurfaceDto) {
    return this.http.post<SurfaceDto>('http://localhost:3000/surfaces', dto);
  }

  deleteSurface(id: number) {
    return this.http.delete(`http://localhost:3000/surfaces/${id}`);
  }
}
