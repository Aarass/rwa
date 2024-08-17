import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import {
  catchError,
  exhaustMap,
  map,
  of,
  switchMap,
  tap,
  throwError,
} from 'rxjs';
import { SportService } from '../services/sport/sport.service';
import {
  createSport,
  createSportSuccess,
  deleteSport,
  deleteSportSuccess,
  loadAllSports,
  loadAllSportsSuccess,
} from './sport.actions';

@Injectable()
export class SportEffects {
  constructor(private actions$: Actions, private sportService: SportService) {}

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
      map((val) => {
        console.log(val);
        return val;
      }),
      exhaustMap((action) => {
        console.log('Effect: about to send sport post req');
        return this.sportService.createSport(action.data).pipe(
          map((data) => {
            console.log(data);
            return createSportSuccess({ data });
          })
        );
      })
    );
  });

  deleteSport$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(deleteSport),
      exhaustMap((action) => {
        return this.sportService.deleteSport(action.id).pipe(
          map(() => {
            return deleteSportSuccess({ id: action.id });
          })
        );
      })
    );
  });
}
