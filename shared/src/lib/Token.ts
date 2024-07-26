export type Role = 'user' | 'admin';
export interface RefreshTokenPayload {
  sub: number;
}

export type AccessToken = string;
export type RefreshToken = string;

// export interface AccessToken {}
// export interface RefreshToken {}
