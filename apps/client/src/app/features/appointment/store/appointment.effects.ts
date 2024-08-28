import { Location } from '@angular/common';
import { HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { Store } from '@ngrx/store';
import { MessageService } from 'primeng/api';
import {
  catchError,
  combineLatest,
  exhaustMap,
  map,
  take,
  throwError,
} from 'rxjs';
import { selectPayload } from '../../auth/store/auth.feature';
import { filtersFeature } from '../../filters/store/filters.feature';
import { AppointmentService } from '../services/appointment/appointment.service';
import {
  cancelAppointment,
  createAppointment,
  createAppointmentSuccess,
  loadAppointments,
  loadAppointmentsFail,
  loadAppointmentsSuccess,
  reloadAppointments,
  updateAppointment,
  updateAppointmentSuccess,
} from './appointment.actions';
import { appointmentFeature } from './appointment.feature';

@Injectable()
export class AppointmentEffects {
  constructor(
    private actions$: Actions,
    private store: Store,
    private appointmentService: AppointmentService,
    private messageService: MessageService,
    private router: Location
  ) {}

  // loadMyAppointments$ = createEffect(() => {
  //   return this.actions$.pipe(
  //     ofType(loadMyAppointments),
  //     exhaustMap(() => {
  //       return this.appointmentService.getMyAppointments().pipe(
  //         map((data) => {
  //           return loadMyAppointmentsSuccess({ data });
  //         })
  //       );
  //     })
  //   );
  // });

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

  cancel$ = createEffect(
    () => {
      return this.actions$.pipe(
        ofType(cancelAppointment),
        exhaustMap((action) => {
          return this.appointmentService
            .cancelAppointment(action.data.id)
            .pipe();
        })
      );
    },
    { dispatch: false }
  );

  load$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(loadAppointments, reloadAppointments),
      exhaustMap(() => {
        return combineLatest([
          this.store.select(filtersFeature.selectFilters),
          this.store.select(filtersFeature.selectOrdering),
          this.store.select(appointmentFeature.selectPaginationInfo),
          selectPayload(this.store),
        ]).pipe(
          take(1),
          exhaustMap((tuple) => {
            const [filters, ordering, paginationInfo, tokenPayload] = tuple;
            return this.appointmentService
              .getFilteredAppointments(
                filters,
                paginationInfo,
                ordering,
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
                }),
                catchError((err: HttpErrorResponse) => {
                  loadAppointmentsFail();
                  return throwError(() => err);
                })
              );
          })
        );
      })
    );
  });
}
