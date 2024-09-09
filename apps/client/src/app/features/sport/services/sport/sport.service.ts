import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { CreateSportDto, SportDto, UpdateSportDto } from '@rwa/shared';

@Injectable({
  providedIn: 'root',
})
export class SportService {
  constructor(private http: HttpClient) {}

  getAllSports() {
    return this.http.get<SportDto[]>('http://localhost:3000/sports');
  }

  createSport(dto: CreateSportDto) {
    return this.http.post<SportDto>('http://localhost:3000/sports', dto);
  }

  updateSport(id: number, dto: UpdateSportDto) {
    return this.http.patch(`http://localhost:3000/sports/${id}`, dto);
  }

  deleteSport(id: number) {
    return this.http.delete(`http://localhost:3000/sports/${id}`);
  }
}
