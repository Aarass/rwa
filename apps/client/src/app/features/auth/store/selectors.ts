import { createFeatureSelector, createSelector } from '@ngrx/store';
import { AuthState } from './state';

const authFeature = createFeatureSelector<AuthState>('auth');

export const selectIsCurrentlyRegistering = createSelector(
  authFeature,
  (slice) => slice.isCurrentlyRegistering
);

export const selectIsCurrentlyLoggingIn = createSelector(
  authFeature,
  (slice) => slice.isCurrentlyLoggingIn
);

export const selectAuthStatus = createSelector(
  authFeature,
  (state) => state.status
);

export const selectDecodedPayload = createSelector(
  authFeature,
  (state) => state.decodedPayload
);

export const selectAccessToken = createSelector(
  authFeature,
  (state) => state.accessToken
);

export const selectAccessTokenWithDecodedPayload = createSelector(
  authFeature,
  (state) => {
    return {
      accessToken: state.accessToken,
      payload: state.decodedPayload,
    };
  }
);
