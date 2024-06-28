export interface AccessTokenPayload {
  username: string;
  sub: number;
}

export interface RefreshTokenPayload {
  sub: number;
}

// export interface AccessToken {}
// export interface RefreshToken {}
