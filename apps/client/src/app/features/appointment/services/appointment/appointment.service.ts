import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import {
  AppointmentDto,
  AppointmentsOrdering,
  CreateAppointmentDto,
  FindAppointmentsDto,
  UpdateAppointmentDto,
  UserDto,
} from '@rwa/shared';
import { UserConfigurableFilters } from '../../../filters/interfaces/filters';
import { ConfigService } from '../../../global/services/config/config.service';
import { PaginationInfo } from '../../store/appointment.feature';

@Injectable({
  providedIn: 'root',
})
export class AppointmentService {
  constructor(private http: HttpClient, private configService: ConfigService) {}

  createAppointment(dto: CreateAppointmentDto) {
    return this.http.post<AppointmentDto>(
      `${this.configService.getBackendBaseURL()}/appointments`,
      dto
    );
  }

  updateAppointment(id: number, dto: UpdateAppointmentDto) {
    return this.http.patch<AppointmentDto>(
      `${this.configService.getBackendBaseURL()}/appointments/${id}`,
      dto
    );
  }

  cancelAppointment(id: number) {
    return this.http.post(
      `${this.configService.getBackendBaseURL()}/appointments/${id}/cancel`,
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

    const { filterByUpses } = userFilters;

    const findOptions: FindAppointmentsDto = {
      filters: {
        ...userFilters,
        age: userAge,
        organizerId: userFilters.onlyMine ? user?.id ?? null : null,
        userId: userFilters.onlyMine
          ? null
          : filterByUpses
          ? user?.id ?? null
          : null,
        skip: paginationInfo.pageSize * paginationInfo.loadedPages,
        take: paginationInfo.pageSize,
      },
      ordering: ordering,
      userLocation: user?.location ?? null,
    };

    return this.http.post<AppointmentDto[]>(
      `${this.configService.getBackendBaseURL()}/appointments/search`,
      findOptions
    );
  }

  getAppointment(id: number) {
    return this.http.get<AppointmentDto>(
      `${this.configService.getBackendBaseURL()}/appointments/${id}`
    );
  }
}
