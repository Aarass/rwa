import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { filtersChanged } from './filter.actions';
import { map } from 'rxjs';
import { reloadAppointments } from '../../appointment/store/appointment.actions';

@Injectable()
export class FilterEffects {
  constructor(private actions$: Actions) {}

  change$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(filtersChanged),
      map(() => {
        return reloadAppointments();
      })
    );
  });
}
