import { z } from 'zod';

export const createUserSchema = z
  .object({
    username: z.string(),
    password: z.string().min(6),
    name: z.string(),
    surname: z.string(),
    birthDate: z.string().date(),
  })
  .required();

export type CreateUserDto = z.infer<typeof createUserSchema>;
