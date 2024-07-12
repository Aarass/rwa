import { z } from 'zod';

export const createSportSchema = z
  .object({
    name: z.string(),
    iconUrl: z.string(),
  })
  .required();

export type CreateSportDto = z.infer<typeof createSportSchema>;

export const addSportToUserSchema = z
  .object({
    sportId: z.number(),
    selfRating: z.number().min(1).max(5),
  })
  .required();

export type AddSportToUserDto = z.infer<typeof addSportToUserSchema>;
