import {
  createFeature,
  createReducer,
  createSelector,
  on,
  Store,
} from '@ngrx/store';
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
  restoreSessionFailed,
  restoreSessionSuccess,
} from './auth.actions';
import { AuthState, AuthStatus } from './auth.state';
import { filter, map } from 'rxjs';

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
    on(register, (state) => {
      return {
        ...state,
        isCurrentlyRegistering: true,
      };
    }),
    on(registerSuccess, registerFailed, (state) => {
      return {
        ...state,
        isCurrentlyRegistering: false,
      };
    }),
    on(login, (state) => {
      return {
        ...state,
        isCurrentlyLoggingIn: true,
      };
    }),
    on(loginSuccess, loginFailed, (state) => {
      return {
        ...state,
        isCurrentlyLoggingIn: false,
      };
    }),
    on(loginSuccess, refreshSuccess, restoreSessionSuccess, (state, action) => {
      return {
        ...state,
        accessToken: action.accessToken,
        decodedPayload: decodeJwt(action.accessToken),
        status: AuthStatus.LoggedIn,
      };
    }),
    on(loginFailed, refreshFailed, restoreSessionFailed, (state) => {
      return {
        ...state,
        accessToken: null,
        decodedPayload: null,
        status: AuthStatus.NotLoggedIn,
      };
    }),
    on(logout, (state) => {
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
    selectIsAdmin: createSelector(selectDecodedPayload, (payload) => {
      return payload?.user.roles.includes('admin') ?? false;
    }),
  }),
});

export const selectPayload = (store: Store) => {
  return store.select(authFeature.selectAuthState).pipe(
    filter((state) => {
      return state.status != null;
    }),
    map((state) => state.decodedPayload)
  );
};

function decodeJwt(accessToken: string): AccessTokenPayload | null {
  const base64Url = accessToken.split('.')[1];
  const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
  const jsonPayload = decodeURIComponent(
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
