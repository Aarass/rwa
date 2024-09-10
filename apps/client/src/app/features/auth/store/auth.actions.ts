import { createAction, props } from '@ngrx/store';
import { AccessToken, LoginUserDto, RegisterUserDto } from '@rwa/shared';

export const register = createAction(
  '[Auth] Register',
  props<{ data: RegisterUserDto }>()
);
export const registerSuccess = createAction(
  '[Auth] Register Success',
  props<{ data: RegisterUserDto }>()
);
export const registerFailed = createAction('[Auth] Register Failed');

export const login = createAction(
  '[Auth] Login',
  props<{ data: LoginUserDto }>()
);
export const loginSuccess = createAction(
  '[Auth] Login Success',
  props<{ accessToken: AccessToken }>()
);
export const loginFailed = createAction('[Auth] Login Failed');

export const restoreSession = createAction('[Auth] Restore Session');
export const restoreSessionSuccess = createAction(
  '[Auth] Restore Session Success',
  props<{ accessToken: AccessToken }>()
);
export const restoreSessionFailed = createAction(
  '[Auth] Restore Session Failed'
);

export const refresh = createAction('[Auth] Refresh');
export const refreshSuccess = createAction(
  '[Auth] Refresh Success',
  props<{ accessToken: AccessToken }>()
);
export const refreshFailed = createAction('[Auth] Refresh Failed');

export const logout = createAction('[Auth] Logout');
