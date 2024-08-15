import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { tap } from 'rxjs';
import { logout } from '../../auth/store/auth.actions';

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
}
