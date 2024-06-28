export interface AccessTokenPayload {
  username: string;
  sub: number;
}

export interface RefreshTokenPayload {
  sub: number;
}

export type AccessToken = string;
export type RefreshToken = string;

// export interface AccessToken {}
// export interface RefreshToken {}
