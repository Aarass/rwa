export type Role = 'user' | 'admin';
export interface RefreshTokenPayload {
  sub: number;
}

export type AccessToken = string;
export type RefreshToken = string;

// export interface AccessToken {}
// export interface RefreshToken {}

export interface AccessTokenPayload {
  user: {
    id: number;
    username: string;
    roles: Role[];
    name: string;
    surname: string;
    phoneNumber: string;
    birthDate: string;
    locationId: string;
    biography: string;
  };
  iat: number;
  exp: number;
}
