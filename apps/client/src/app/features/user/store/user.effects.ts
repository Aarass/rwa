import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { loadMe, loadMeSuccess } from './user.actions';
import { exhaustMap, map } from 'rxjs';
import { UserService } from '../services/user/user.service';

@Injectable()
export class UserEffects {
  constructor(private actions$: Actions, private userService: UserService) {}

  load$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(loadMe),
      exhaustMap((action) => {
        return this.userService.getUserById(action.id).pipe(
          map((user) => {
            return loadMeSuccess({ data: user });
          })
        );
      })
    );
  });
}
