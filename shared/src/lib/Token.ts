export type Role = 'user' | 'admin';
export interface AccessTokenPayload {
  username: string;
  sub: number;
  roles: Role[];
}

export interface RefreshTokenPayload {
  sub: number;
}

export type AccessToken = string;
export type RefreshToken = string;

// export interface AccessToken {}
// export interface RefreshToken {}
