import { z } from 'zod';

export const createRatingSchema = z
  .object({
    userRatedId: z.number(),
    userRatingId: z.number(),
    value: z.number().min(1).max(5),
  })
  .required();

export type CreateRatingDto = z.infer<typeof createRatingSchema>;
