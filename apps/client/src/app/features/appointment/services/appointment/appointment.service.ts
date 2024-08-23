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

  getFilteredAppointments(
    userFilters: UserConfigurableFilters,
    paginationInfo: PaginationInfo,
    ordering: AppointmentsOrdering | null,
    user: UserDto | null
  ) {
    let userAge = null;

    if (user) {
      var ageDifMs = Date.now() - new Date(user.birthDate).getTime();
      var ageDate = new Date(ageDifMs);
      userAge = Math.abs(ageDate.getUTCFullYear() - 1970);
    }

    const findOptions: FindAppointmentsDto = {
      filters: {
        ...userFilters,
        age: userAge,
        canceled: false,
        organizerId: null,
        userId: user?.id ?? null,
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

  getMyAppointments() {
    return this.store.select(authFeature.selectDecodedPayload).pipe(
      filter((val) => val != null),
      take(1),
      exhaustMap((payload) => {
        const findOptions: FindAppointmentsDto = {
          filters: {
            organizerId: payload!.user.id,
            sportId: null,
            age: null,
            userId: null,
            minDate: null,
            maxDate: null,
            minTime: null,
            maxTime: null,
            maxPrice: null,
            maxDistance: null,
            canceled: null,
            skip: null,
            take: null,
          },
          ordering: null,
          userLocation: null,
        };

        return this.http.post<AppointmentDto[]>(
          'http://localhost:3000/appointments/search',
          findOptions
        );
      })
    );
  }
}
