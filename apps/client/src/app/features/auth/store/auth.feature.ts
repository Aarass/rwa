import { createFeature, createReducer, createSelector, on } from '@ngrx/store';
import { AccessTokenPayload } from '@rwa/shared';
import {
  login,
  loginFailed,
  loginSuccess,
  logout,
  refreshFailed,
  refreshSuccess,
  register,
  registerFailed,
  registerSuccess,
} from './auth.actions';
import { AuthState, AuthStatus } from './auth.state';

const initialState: AuthState = {
  status: null,
  decodedPayload: null,
  accessToken: null,
  isCurrentlyRegistering: false,
  isCurrentlyLoggingIn: false,
};

export const authFeature = createFeature({
  name: 'auth',
  reducer: createReducer(
    initialState,
    on(register, (state, _) => {
      return {
        ...state,
        isCurrentlyRegistering: true,
      };
    }),
    on(registerSuccess, registerFailed, (state, _) => {
      return {
        ...state,
        isCurrentlyRegistering: false,
      };
    }),
    on(login, (state, _) => {
      return {
        ...state,
        isCurrentlyLoggingIn: true,
      };
    }),
    on(loginSuccess, loginFailed, (state, _) => {
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
    on(loginFailed, refreshFailed, (state, _) => {
      return {
        ...state,
        accessToken: null,
        decodedPayload: null,
        status: AuthStatus.NotLoggedIn,
      };
    }),
    on(logout, (state, _) => {
      return {
        ...state,
        accessToken: null,
        decodedPayload: null,
        status: AuthStatus.NotLoggedIn,
      };
    })
  ),
  extraSelectors: ({ selectAccessToken, selectDecodedPayload }) => ({
    selectAccessTokenWithDecodedPayload: createSelector(
      selectAccessToken,
      selectDecodedPayload,
      (accessToken, decodedPayload) => {
        return {
          accessToken: accessToken,
          payload: decodedPayload,
        };
      }
    ),
  }),
});

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
