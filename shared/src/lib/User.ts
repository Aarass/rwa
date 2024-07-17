import { z } from 'zod';

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
    city: z.string(),
    biography: z.string(),
  })
  .required();

export type CreateUserDto = z.infer<typeof createUserSchema>;
export type RegisterUserDto = CreateUserDto;
