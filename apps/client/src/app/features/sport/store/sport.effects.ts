import { Actions, createEffect, ofType } from '@ngrx/effects';
import { loadAllSports, loadAllSportsSuccess } from './sport.actions';
import { exhaustMap, map } from 'rxjs';
import { SportService } from '../services/sport/sport.service';
import { Injectable } from '@angular/core';

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
}
