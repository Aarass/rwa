import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { Store } from '@ngrx/store';
import { DialogService } from 'primeng/dynamicdialog';
import { filter, map, merge, switchMap, tap } from 'rxjs';
import { reloadAppointments } from '../../appointment/store/appointment.actions';
import { LoginComponent } from '../../auth/components/login/login.component';
import {
  loginSuccess,
  logout,
  restoreSessionSuccess,
} from '../../auth/store/auth.actions';
import { authFeature } from '../../auth/store/auth.feature';
import { AuthStatus } from '../../auth/store/auth.state';
import { loadMyParticipations } from '../../participation/store/participation.actions';
import { loadMyUpses } from '../../ups/store/ups.actions';
import { loadMe, loadMeSuccess } from '../../user/store/user.actions';
import { openSignIn } from '../actions/global.actions';

@Injectable()
export class GlobalEffects {
  constructor(
    private store: Store,
    private actions$: Actions,
    private router: Router,
    private dialogService: DialogService
  ) {}
  openSignIn$ = createEffect(
    () => {
      return this.actions$.pipe(
        ofType(openSignIn),
        switchMap(() => {
          const dialogRef = this.dialogService.open(LoginComponent, {
            header: 'Sign in',
            modal: true,
            draggable: false,
            resizable: false,
            dismissableMask: true,
          });

          const innerClose$ = dialogRef.onChildComponentLoaded.pipe(
            switchMap((val) => val.close)
          );

          const autoClose$ = this.store
            .select(authFeature.selectStatus)
            .pipe(filter((val) => val === AuthStatus.LoggedIn));

          return merge(innerClose$, autoClose$).pipe(
            tap(() => {
              dialogRef.close();
            })
          );
        })
      );
    },
    { dispatch: false }
  );

  loadMe$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(loginSuccess, restoreSessionSuccess),
      map(() => loadMe())
    );
  });

  loadAppointments$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(loadMeSuccess),
      map(() => reloadAppointments())
    );
  });

  loadMyParticipations$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(loginSuccess, restoreSessionSuccess),
      map(() => loadMyParticipations())
    );
  });

  loadMyUpses$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(loginSuccess, restoreSessionSuccess),
      map(() => loadMyUpses())
    );
  });

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
