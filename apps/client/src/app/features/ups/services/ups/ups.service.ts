import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { CreateUpsDto, UpdateUpsDto, UpsDto } from '@rwa/shared';

@Injectable({
  providedIn: 'root',
})
export class UpsService {
  constructor(private http: HttpClient) {}

  getMyUpses() {
    return this.http.get<UpsDto[]>('http://localhost:3000/ups/user/me');
  }

  createUps(dto: CreateUpsDto) {
    return this.http.post<UpsDto>('http://localhost:3000/ups', dto);
  }

  updateUps(id: number, dto: UpdateUpsDto) {
    return this.http.patch(`http://localhost:3000/ups/${id}`, dto);
  }

  deleteUps(id: number) {
    return this.http.delete(`http://localhost:3000/ups/${id}`);
  }
}
