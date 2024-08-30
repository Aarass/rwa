import { z } from 'zod';

export const createRatingSchema = z
  .object({
    userRatedId: z.number(),
    userRatingId: z.number(),
    value: z.number().min(1).max(5),
  })
  .required();

export type CreateRatingDto = z.infer<typeof createRatingSchema>;
export type RatingDto = {
  id: number;
  value: number;
};

export type RatingStatsDto = {
  avg: number | null;
  count: number;
};

export const deleteRatingSchema = z
  .object({
    userRatedId: z.number(),
    userRatingId: z.number(),
  })
  .required();

export type deleteRatingDto = z.infer<typeof deleteRatingSchema>;
