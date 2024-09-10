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
  imageName: string | null;
}
export type UserInfo = {
  user: UserDto;
  stats: {
    organizedAppointments: number;
    maxOrganizedAppointments: number;
    participatedAppointments: number;
    maxParticipations: number;
  }[];
};

export const createUserSchema = z.object({
  username: z.string().trim().min(1, 'Username is too short'),
  password: z
    .string()
    .regex(
      new RegExp('^[a-zA-Z0-9_.-]*$'),
      `Password can contain only letters, numbers, '-' and '_' `
    )
    .min(6, 'Password needs to be at least 6 letters long'),
  name: z.string().trim().min(1, 'Name is too short'),
  surname: z.string().trim().min(1, 'Surname is too short'),
  phoneNumber: z
    .string()
    .trim()
    .regex(
      new RegExp('^[+]?[(]?[0-9]{3}[)]?[-s.]?[0-9]{3}[-s.]?[0-9]{4,6}$'),
      'Invalid phone number'
    ),
  birthDate: z.string({ message: 'You must select a date' }).date(),
  locationId: z
    .string({ message: 'You must select a valid location' })
    .trim()
    .min(1),
  biography: z.string(),
});

export type CreateUserDto = z.infer<typeof createUserSchema>;
export const registerUserSchema = createUserSchema;
export type RegisterUserDto = CreateUserDto;

export interface LoginUserDto {
  username: string;
  password: string;
}
