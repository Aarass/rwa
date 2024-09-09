import { createAction, props } from '@ngrx/store';
import { UserDto } from '@rwa/shared';

export const loadMe = createAction('[User] Load Me');
export const loadMeSuccess = createAction(
  '[User] Load Me Success',
  props<{ data: UserDto }>()
);

export const setImage = createAction(
  '[User] Set Image',
  props<{ name: string | null }>()
);
