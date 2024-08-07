import { createReducer, on } from '@ngrx/store';
import { AuthState, AuthStatus } from './state';
import {
  login,
  loginFailed,
  loginSuccess,
  refreshFailed,
  refreshSuccess,
  register,
  registerFailed,
  registerSuccess,
} from './actions';
import { AccessTokenPayload } from '@rwa/shared';

const initialState: AuthState = {
  status: AuthStatus.NotLoggedIn,
  decodedPayload: null,
  accessToken: null,
  isCurrentlyRegistering: false,
  isCurrentlyLoggingIn: false,
};

export const authReducer = createReducer(
  initialState,
  on(register, (state, action) => {
    return {
      ...state,
      isCurrentlyRegistering: true,
    };
  }),
  on(registerSuccess, registerFailed, (state, action) => {
    return {
      ...state,
      isCurrentlyRegistering: false,
    };
  }),
  on(login, (state, action) => {
    return {
      ...state,
      isCurrentlyLoggingIn: true,
    };
  }),
  on(loginSuccess, loginFailed, (state, action) => {
    return {
      ...state,
      isCurrentlyLoggingIn: false,
    };
  }),
  on(loginSuccess, refreshSuccess, (state, action) => {
    return {
      ...state,
      accessToken: action.accessToken,
      decodedPayload: decodeJwt(action.accessToken),
      status: AuthStatus.LoggedIn,
    };
  }),
  on(loginFailed, refreshFailed, (state, action) => {
    return {
      ...state,
      accessToken: null,
      decodedPayload: null,
      status: AuthStatus.NotLoggedIn,
    };
  })
);

function decodeJwt(accessToken: string): AccessTokenPayload | null {
  var base64Url = accessToken.split('.')[1];
  var base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
  var jsonPayload = decodeURIComponent(
    window
      .atob(base64)
      .split('')
      .map(function (c) {
        return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
      })
      .join('')
  );

  return JSON.parse(jsonPayload);
}
