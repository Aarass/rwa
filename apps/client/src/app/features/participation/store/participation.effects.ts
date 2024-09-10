import { HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { MessageService } from 'primeng/api';
import { catchError, EMPTY, exhaustMap, map, of, throwError } from 'rxjs';
import { ParticipationService } from '../services/participation/participation.service';
import { ParticipationsSidebarService } from '../services/participations-sidebar/participations-sidebar.service';
import {
  joinAppointment,
  joinAppointmentFail,
  joinAppointmentSuccess,
  leaveAppointment,
  loadMyParticipations,
  loadMyParticipationsSuccess,
  markChangesAsSeen,
  rejectParticipation,
  showParticipants,
} from './participation.actions';

@Injectable()
export class ParticipationEffects {
  constructor(
    private actions$: Actions,
    private participationService: ParticipationService,
    private messageService: MessageService,
    private participationsSidebarService: ParticipationsSidebarService
  ) {}

  load$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(loadMyParticipations),
      exhaustMap(() => {
        return this.participationService.getMyParticipations().pipe(
          map((data) => {
            return loadMyParticipationsSuccess({ data });
          })
        );
      })
    );
  });

  join$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(joinAppointment),
      exhaustMap((action) => {
        return this.participationService
          .createParticipation({
            appointmentId: action.appointmentId,
          })
          .pipe(
            map((participation) => {
              return joinAppointmentSuccess({ data: participation });
            }),
            catchError((err: HttpErrorResponse) => {
              console.log(err);
              this.messageService.add({
                key: 'global',
                severity: 'error',
                summary: err.error.message,
              });
              return of(
                joinAppointmentFail({
                  appointmentId: action.appointmentId,
                })
              );
            })
          );
      })
    );
  });

  leave$ = createEffect(
    () => {
      return this.actions$.pipe(
        ofType(leaveAppointment),
        exhaustMap((action) => {
          return this.participationService.deleteParticipation(
            action.data.participationId
          );
        })
      );
    },
    { dispatch: false }
  );

  markSeen$ = createEffect(
    () => {
      return this.actions$.pipe(
        ofType(markChangesAsSeen),
        exhaustMap((action) => {
          return this.participationService.markSeen(action.participationId);
        })
      );
    },
    { dispatch: false }
  );

  reject$ = createEffect(
    () => {
      return this.actions$.pipe(
        ofType(rejectParticipation),
        exhaustMap((action) => {
          return this.participationService
            .rejectParticipation(action.data.participationId)
            .pipe(
              catchError((err: HttpErrorResponse) => {
                this.messageService.add({
                  key: 'global',
                  severity: 'error',
                  summary: err.error.message,
                });
                return throwError(() => err);
              })
            );
        })
      );
    },
    { dispatch: false }
  );

  show$ = createEffect(
    () => {
      return this.actions$.pipe(
        ofType(showParticipants),
        exhaustMap(() => {
          this.participationsSidebarService.open();
          return EMPTY;
        })
      );
    },
    { dispatch: false }
  );
}
