import { z } from 'zod';

export const createSportSchema = z
  .object({
    name: z.string(),
    iconUrl: z.string(),
  })
  .required();

export type CreateSportDto = z.infer<typeof createSportSchema>;
