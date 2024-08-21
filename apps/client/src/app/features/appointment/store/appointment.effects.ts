import { Location } from '@angular/common';
import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import {
  catchError,
  combineLatest,
  EMPTY,
  exhaustMap,
  map,
  take,
  throttleTime,
  throwError,
  withLatestFrom,
} from 'rxjs';
import { AppointmentService } from '../services/appointment/appointment.service';
import {
  createAppointment,
  createAppointmentSuccess,
  loadAppointments,
  loadAppointmentsSuccess,
  loadMyAppointments,
  loadMyAppointmentsSuccess,
  updateAppointment,
  updateAppointmentSuccess,
} from './appointment.actions';
import { Store } from '@ngrx/store';
import { appointmentFeature } from './appointment.feature';
import { authFeature, selectPayload } from '../../auth/store/auth.feature';
import { filtersChanged } from '../../filters/store/filter.actions';
import { filtersFeature } from '../../filters/store/filters.feature';
import { MessageService } from 'primeng/api';
import { HttpErrorResponse } from '@angular/common/http';

@Injectable()
export class AppointmentEffects {
  constructor(
    private actions$: Actions,
    private store: Store,
    private appointmentService: AppointmentService,
    private messageService: MessageService,
    private router: Location
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
            this.router.back();
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
              this.router.back();
              return updateAppointmentSuccess({ data });
            })
          );
      })
    );
  });

  load$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(loadAppointments, filtersChanged),
      exhaustMap((action) => {
        return combineLatest([
          this.store.select(filtersFeature.selectFilters),
          this.store.select(appointmentFeature.selectPaginationInfo),
          selectPayload(this.store),
        ]).pipe(
          take(1),
          exhaustMap((tuple) => {
            const [filters, paginationInfo, tokenPayload] = tuple;
            return this.appointmentService
              .getFilteredAppointments(
                filters,
                paginationInfo,
                null,
                tokenPayload == null ? null : tokenPayload.user
              )
              .pipe(
                map((appointments) => {
                  if (appointments.length == 0) {
                    this.messageService.add({
                      key: 'global',
                      severity: 'error',
                      summary: 'There is no appointments to show',
                    });
                  }
                  return loadAppointmentsSuccess({ data: appointments });
                })
                // catchError((err: HttpErrorResponse) => {
                //   return throwError(() => err);
                // })
              );
          })
        );
      })
    );
  });
}
