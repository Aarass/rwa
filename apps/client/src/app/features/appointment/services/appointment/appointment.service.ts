import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Store } from '@ngrx/store';
import {
  AppointmentDto,
  CreateAppointmentDto,
  FindAppointmentsDto,
  UpdateAppointmentDto,
} from '@rwa/shared';
import { authFeature } from '../../../auth/store/auth.feature';
import { exhaustMap, filter, map, take } from 'rxjs';

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

  getMyAppointments() {
    return this.store.select(authFeature.selectDecodedPayload).pipe(
      filter((val) => val != null),
      take(1),
      exhaustMap((payload) => {
        const findOptions: FindAppointmentsDto = {
          filters: {
            organizerId: payload!.user.id,
          },
        };

        return this.http.post<AppointmentDto[]>(
          'http://localhost:3000/appointments/search',
          findOptions
        );
      })
    );
  }
}
