import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { map, tap } from 'rxjs';
import {
  loginSuccess,
  logout,
  refreshSuccess,
} from '../../auth/store/auth.actions';
import { loadMyParticipations } from '../../participation/store/participation.actions';
import { reloadAppointments } from '../../appointment/store/appointment.actions';

@Injectable()
export class GlobalEffects {
  constructor(private actions$: Actions, private router: Router) {}

  logout$ = createEffect(
    () => {
      return this.actions$.pipe(
        ofType(logout),
        tap(() => {
          this.router.navigate(['']);
        })
      );
    },
    { dispatch: false }
  );

  loadAppointments$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(loginSuccess, refreshSuccess),
      map(() => reloadAppointments())
    );
  });

  loadMyParticipations$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(loginSuccess, refreshSuccess),
      map(() => loadMyParticipations())
    );
  });
}
