import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { AppointmentService } from '../services/appointment/appointment.service';
import {
  createAppointment,
  createAppointmentSuccess,
  loadMyAppointments,
  loadMyAppointmentsSuccess,
  updateAppointment,
  updateAppointmentSuccess,
} from './appointment.actions';
import { exhaustMap, map } from 'rxjs';

@Injectable()
export class AppointmentEffects {
  constructor(
    private actions$: Actions,
    private appointmentService: AppointmentService
  ) {}

  loadMyAppointments$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(loadMyAppointments),
      exhaustMap(() => {
        return this.appointmentService.getMyAppointments().pipe(
          map((data) => {
            return loadMyAppointmentsSuccess({ data });
          })
        );
      })
    );
  });

  create$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(createAppointment),
      exhaustMap((action) => {
        return this.appointmentService.createAppointment(action.data).pipe(
          map((appointment) => {
            return createAppointmentSuccess({ data: appointment });
          })
        );
      })
    );
  });

  update$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(updateAppointment),
      exhaustMap((action) => {
        return this.appointmentService
          .updateAppointment(action.data.id, action.data.changes)
          .pipe(
            map((data) => {
              return updateAppointmentSuccess({ data });
            })
          );
      })
    );
  });
}
