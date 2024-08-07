import { createAction, props } from '@ngrx/store';
import { AccessToken, LoginUserDto, RegisterUserDto } from '@rwa/shared';

export const register = createAction(
  '[Auth] Register',
  props<RegisterUserDto>()
);

export const registerSuccess = createAction(
  '[Auth] Register Success',
  props<RegisterUserDto>()
);
export const registerFailed = createAction('[Auth] Register Failed');

export const login = createAction('[Auth] Login', props<LoginUserDto>());

export const loginSuccess = createAction(
  '[Auth] Login Success',
  props<{ accessToken: AccessToken }>()
);
export const loginFailed = createAction('[Auth] Login Failed');

export const refresh = createAction('[Auth] Refresh');

export const refreshSuccess = createAction(
  '[Auth] Refresh Success',
  props<{ accessToken: AccessToken }>()
);
export const refreshFailed = createAction('[Auth] Refresh Failed');
