export type Role = 'user' | 'admin';

export type AccessToken = string;
export type RefreshToken = string;

export type TokenUser = {
  id: number;
  roles: Role[];
};

export interface AccessTokenPayload {
  user: TokenUser;
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
