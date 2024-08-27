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
  '[Appointment] update Appointment Success',
  props<{ data: AppointmentDto }>()
);
export const updateAppointmentFail = createAction(
  '[Appointment] update Appointment Fail'
);

export const loadMyAppointments = createAction(
  '[Appointment] Load My Appointments'
);
export const loadMyAppointmentsSuccess = createAction(
  '[Appointment] Load My Appointments Success',
  props<{ data: AppointmentDto[] }>()
);

// My
// ---------------------------------------------------------------------------------------
// All

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
