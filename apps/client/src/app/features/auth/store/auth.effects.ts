import { HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { MessageService } from 'primeng/api';
import { catchError, exhaustMap, map, of, tap } from 'rxjs';
import { AuthService } from '../services/auth/auth.service';
import {
  login,
  loginFailed,
  loginSuccess,
  logout,
  refresh,
  refreshFailed,
  refreshSuccess,
  register,
  registerFailed,
  registerSuccess,
  restoreSession,
  restoreSessionFailed,
  restoreSessionSuccess,
} from './auth.actions';

@Injectable()
export class AuthEffects {
  constructor(
    private actions$: Actions,
    private messageService: MessageService,
    private authService: AuthService
  ) {}

  register$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(register),
      exhaustMap((data) => {
        const registerUserDto = data;
        return this.authService.register(registerUserDto).pipe(
          map(() => {
            this.messageService.add({
              key: 'global',
              severity: 'success',
              summary: 'Successfully signed up',
            });
            return registerSuccess(registerUserDto);
          }),
          catchError((err) => {
            this.messageService.add({
              key: 'global',
              severity: 'error',
              summary: 'Unexpected error',
            });
            console.error(err);
            return of(registerFailed());
          })
        );
      })
    );
  });

  login$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(login, registerSuccess),
      exhaustMap((data) => {
        return this.authService.login(data.username, data.password).pipe(
          map((data) => {
            this.messageService.add({
              key: 'global',
              severity: 'success',
              summary: 'Successfully signed in',
            });
            return loginSuccess(data);
          }),
          catchError((err: HttpErrorResponse) => {
            if (err.status === 401) {
              this.messageService.add({
                key: 'global',
                severity: 'error',
                // TODO
                summary: 'Sign in failed',
              });
            } else {
              this.messageService.add({
                key: 'global',
                severity: 'error',
                summary: 'Unexpected error',
              });
              console.error(err);
            }
            return of(loginFailed());
          })
        );
      })
    );
  });

  refresh$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(refresh, restoreSession),
      exhaustMap((action) => {
        return this.authService.refresh().pipe(
          map((data) => {
            if (action.type === restoreSession.type) {
              return restoreSessionSuccess(data);
            } else {
              return refreshSuccess(data);
            }
          }),
          catchError(() => {
            if (action.type === restoreSession.type) {
              return of(restoreSessionFailed());
            } else {
              return of(refreshFailed());
            }
          })
        );
      })
    );
  });

  logout$ = createEffect(
    () => {
      return this.actions$.pipe(
        ofType(logout),
        exhaustMap(() => {
          return this.authService.logout().pipe(
            tap(() => {
              this.messageService.add({
                key: 'global',
                severity: 'success',
                summary: 'Logged out successfully',
              });
            })
          );
        })
      );
    },
    { dispatch: false }
  );
}
