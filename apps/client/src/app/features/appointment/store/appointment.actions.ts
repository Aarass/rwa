import { createAction, props } from '@ngrx/store';
import {
  AppointmentDto,
  CreateAppointmentDto,
  UpdateAppointmentDto,
} from '@rwa/shared';

export const createAppointment = createAction(
  '[Appointment] Create Appointment',
  props<{ data: CreateAppointmentDto }>()
);
export const createAppointmentSuccess = createAction(
  '[Appointment] Create Appointment Success',
  props<{ data: AppointmentDto }>()
);
export const createAppointmentFail = createAction(
  '[Appointment] Create Appointment Fail'
);

export const updateAppointment = createAction(
  '[Appointment] Update Appointment',
  props<{
    data: {
      id: number;
      changes: UpdateAppointmentDto;
    };
  }>()
);
export const updateAppointmentSuccess = createAction(
  '[Appointment] Update Appointment Success',
  props<{ data: AppointmentDto }>()
);
export const updateAppointmentFail = createAction(
  '[Appointment] Update Appointment Fail'
);

export const cancelAppointment = createAction(
  '[Appointment] Cancel Appointment',
  props<{ data: AppointmentDto }>()
);

export const loadAppointments = createAction('[Appointment] Load Appointments');
export const reloadAppointments = createAction(
  '[Appointment] Reload Appointments'
);

export const loadAppointmentsSuccess = createAction(
  '[Appointment] Load Appointments Success',
  props<{ data: AppointmentDto[] }>()
);
export const loadAppointmentsFail = createAction(
  '[Appointment] Load Appointments Fail'
);

export const addAppointment = createAction(
  '[Appoitment] Add Appointment',
  props<{ data: AppointmentDto }>()
);

export const removeAppointment = createAction(
  '[Appoitment] Remove Appointment',
  props<{ id: number }>()
);
