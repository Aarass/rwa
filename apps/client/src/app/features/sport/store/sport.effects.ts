import { HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { MessageService } from 'primeng/api';
import { catchError, exhaustMap, map, throwError } from 'rxjs';
import { SportService } from '../services/sport/sport.service';
import {
  createSport,
  createSportSuccess,
  deleteSport,
  deleteSportSuccess,
  loadAllSports,
  loadAllSportsSuccess,
  updateSport,
} from './sport.actions';

@Injectable()
export class SportEffects {
  constructor(
    private actions$: Actions,
    private sportService: SportService,
    private messageService: MessageService
  ) {}

  loadAllSports$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(loadAllSports),
      exhaustMap(() => {
        return this.sportService.getAllSports().pipe(
          map((sports) => {
            return loadAllSportsSuccess({ sports });
          })
        );
      })
    );
  });

  createSport$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(createSport),
      exhaustMap((action) => {
        return this.sportService.createSport(action.data).pipe(
          map((data) => {
            return createSportSuccess({ data });
          })
        );
      })
    );
  });

  updateSport$ = createEffect(
    () => {
      return this.actions$.pipe(
        ofType(updateSport),
        exhaustMap((action) => {
          return this.sportService.updateSport(action.data.id, action.data.dto);
        })
      );
    },
    { dispatch: false }
  );

  deleteSport$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(deleteSport),
      exhaustMap((action) => {
        return this.sportService.deleteSport(action.id).pipe(
          map(() => {
            return deleteSportSuccess({ id: action.id });
          }),
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
  });
}
