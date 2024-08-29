import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Store } from '@ngrx/store';
import {
  AppointmentDto,
  AppointmentsOrdering,
  CreateAppointmentDto,
  FindAppointmentsDto,
  UpdateAppointmentDto,
  UserDto,
} from '@rwa/shared';
import { authFeature } from '../../../auth/store/auth.feature';
import { exhaustMap, filter, map, Observable, of, take } from 'rxjs';
import { PaginationInfo } from '../../store/appointment.feature';
import { UserConfigurableFilters } from '../../../filters/interfaces/filters';

@Injectable({
  providedIn: 'root',
})
export class AppointmentService {
  constructor(private http: HttpClient, private store: Store) {}

  createAppointment(dto: CreateAppointmentDto) {
    return this.http.post<AppointmentDto>(
      'http://localhost:3000/appointments',
      dto
    );
  }

  updateAppointment(id: number, dto: UpdateAppointmentDto) {
    return this.http.patch<AppointmentDto>(
      `http://localhost:3000/appointments/${id}`,
      dto
    );
  }

  cancelAppointment(id: number) {
    return this.http.post(
      `http://localhost:3000/appointments/${id}/cancel`,
      {}
    );
  }

  getFilteredAppointments(
    userFilters: UserConfigurableFilters,
    paginationInfo: PaginationInfo,
    ordering: AppointmentsOrdering | null,
    user: UserDto | null
  ) {
    let userAge = null;

    if (user) {
      const ageDifMs = Date.now() - new Date(user.birthDate).getTime();
      const ageDate = new Date(ageDifMs);
      userAge = Math.abs(ageDate.getUTCFullYear() - 1970);
    }

    let filterByUpses;
    if (user && user.roles.includes('admin')) {
      filterByUpses = false;
    }

    const findOptions: FindAppointmentsDto = {
      filters: {
        ...userFilters,
        age: userAge,
        organizerId: userFilters.onlyMine ? user?.id ?? null : null,
        userId: userFilters.onlyMine
          ? null
          : userFilters.filterByUpses
          ? user?.id ?? null
          : null,
        skip: paginationInfo.pageSize * paginationInfo.loadedPages,
        take: paginationInfo.pageSize,
      },
      ordering: ordering,
      userLocation: user?.location ?? null,
    };

    return this.http.post<AppointmentDto[]>(
      'http://localhost:3000/appointments/search',
      findOptions
    );
  }

  getAppointment(id: number) {
    return this.http.get<AppointmentDto>(
      `http://localhost:3000/appointments/${id}`
    );
  }
}
