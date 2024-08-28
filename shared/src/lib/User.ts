import { z } from 'zod';
import { LocationDto, Role } from '..';

export interface UserDto {
  id: number;
  username: string;
  roles: Role[];
  name: string;
  surname: string;
  phoneNumber: string;
  birthDate: string;
  locationId: string;
  location: LocationDto;
  biography: string | null;
}
export type UserInfo = {
  user: UserDto;
  stats: {
    organizedAppointments: number;
    participatedAppointments: number;
  }[];
};

export const createUserSchema = z
  .object({
    username: z.string(),
    password: z.string().min(6),
    name: z.string(),
    surname: z.string(),
    phoneNumber: z
      .string()
      .regex(
        new RegExp('^[+]?[(]?[0-9]{3}[)]?[-s.]?[0-9]{3}[-s.]?[0-9]{4,6}$')
      ),
    birthDate: z.string().date(),
    locationId: z.string(),
    biography: z.string(),
  })
  .required();

export type CreateUserDto = z.infer<typeof createUserSchema>;
export const registerUserSchema = createUserSchema;
export type RegisterUserDto = CreateUserDto;
export interface LoginUserDto {
  username: string;
  password: string;
}
