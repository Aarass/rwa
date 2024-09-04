import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { filter, map, switchMap, tap } from 'rxjs';
import {
  loginFailed,
  loginSuccess,
  logout,
  refreshFailed,
  refreshSuccess,
} from '../../auth/store/auth.actions';
import { loadMyParticipations } from '../../participation/store/participation.actions';
import { reloadAppointments } from '../../appointment/store/appointment.actions';
import { loadMe, noUser } from '../../user/store/user.actions';
import { Store } from '@ngrx/store';
import { authFeature, selectPayload } from '../../auth/store/auth.feature';

@Injectable()
export class GlobalEffects {
  constructor(
    private actions$: Actions,
    private router: Router,
    private store: Store
  ) {}

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

  nullUser$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(loginFailed, refreshFailed, logout),
      tap(console.log),
      map(() => noUser())
    );
  });

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

  loadMe$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(loginSuccess, refreshSuccess),
      switchMap(() => {
        return this.store.select(authFeature.selectDecodedPayload).pipe(
          filter((payload) => payload != null),
          map((val) => val!),
          map((payload) => {
            return loadMe({ id: payload.user.id });
          })
        );
      })
    );
  });
}
