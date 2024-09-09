export type Role = 'user' | 'admin';

export type AccessToken = string;
export type RefreshToken = string;

export interface AccessTokenPayload {
  user: {
    id: number;
    roles: Role[];
  };
  iat: number;
  exp: number;
}

export interface RefreshTokenPayload {
  sub: number;
}
// username: string;
// name: string;
// surname: string;
// phoneNumber: string;
// birthDate: string;
// locationId: string;
// location: LocationDto;
// biography: string;
// imageName: string | null;
