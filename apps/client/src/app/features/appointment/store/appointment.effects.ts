import { Location } from '@angular/common';
import { HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
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
import { filtersFeature } from '../../filters/store/filters.feature';
import {
  createUpsSuccess,
  deleteUpsSuccess,
  updateUpsSuccess,
} from '../../ups/store/ups.actions';
import { selectUser } from '../../user/store/user.feature';
import { AppointmentService } from '../services/appointment/appointment.service';
import {
  addAppointment,
  cancelAppointment,
  createAppointment,
  createAppointmentSuccess,
  loadAppointment,
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
    private location: Location,
    private router: Router
  ) {}

  create$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(createAppointment),
      exhaustMap((action) => {
        return this.appointmentService.createAppointment(action.data).pipe(
          map((appointment) => {
            this.router.navigateByUrl(`appointment?id=${appointment.id}`);
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
              this.location.back();
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

  loadById = createEffect(() => {
    return this.actions$.pipe(
      ofType(loadAppointment),
      exhaustMap((action) => {
        return this.appointmentService.getAppointment(action.id).pipe(
          map((data) => {
            return addAppointment({ data });
          })
        );
      })
    );
  });

  load$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(loadAppointments, reloadAppointments),
      exhaustMap((action) => {
        return combineLatest([
          this.store.select(filtersFeature.selectFilters),
          this.store.select(filtersFeature.selectOrdering),
          this.store.select(appointmentFeature.selectPaginationInfo),
          selectUser(this.store),
        ]).pipe(
          take(1),
          exhaustMap((tuple) => {
            const [filters, ordering, paginationInfo, user] = tuple;
            return this.appointmentService
              .getFilteredAppointments(filters, paginationInfo, ordering, user)
              .pipe(
                map((appointments) => {
                  if (appointments.length === 0) {
                    if (action.type === loadAppointments.type) {
                      this.messageService.add({
                        key: 'global',
                        severity: 'error',
                        summary: 'There is no appointments to show',
                      });
                    }
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

  reload$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(createUpsSuccess, deleteUpsSuccess, updateUpsSuccess),
      map(() => {
        return reloadAppointments();
      })
    );
  });
}
