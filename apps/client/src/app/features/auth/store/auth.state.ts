import { AccessTokenPayload } from '@rwa/shared';

export interface AuthState {
  status: AuthStatus | null;
  decodedPayload: AccessTokenPayload | null;
  accessToken: string | null;
  isCurrentlyRegistering: boolean;
  isCurrentlyLoggingIn: boolean;
}

export enum AuthStatus {
  NotLoggedIn,
  LoggedIn,
}
