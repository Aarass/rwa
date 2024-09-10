import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { catchError, exhaustMap, map, of } from 'rxjs';
import { UpsService } from '../services/ups/ups.service';
import {
  createUps,
  createUpsFail,
  createUpsSuccess,
  deleteUps,
  deleteUpsSuccess,
  loadMyUpses,
  loadMyUpsesSuccess,
  updateUps,
  updateUpsSuccess,
} from './ups.actions';

@Injectable()
export class UpsEffects {
  constructor(private actions$: Actions, private upsService: UpsService) {}

  loadMyUpses$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(loadMyUpses),
      exhaustMap(() => {
        return this.upsService.getMyUpses().pipe(
          map((upses) => {
            return loadMyUpsesSuccess({ upses });
          })
        );
      })
    );
  });

  createUps$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(createUps),
      exhaustMap((action) => {
        return this.upsService.createUps(action.data).pipe(
          map((data) => {
            return createUpsSuccess({ data });
          }),
          catchError((err) => {
            console.error(err);
            return of(createUpsFail());
          })
        );
      })
    );
  });

  updateUps$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(updateUps),
      exhaustMap((action) => {
        return this.upsService
          .updateUps(action.data.id, action.data.changes)
          .pipe(map(() => updateUpsSuccess()));
      })
    );
  });

  deleteUps$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(deleteUps),
      exhaustMap((action) => {
        return this.upsService
          .deleteUps(action.id)
          .pipe(map(() => deleteUpsSuccess()));
      })
    );
  });
}
