import { z } from 'zod';

export const createLocationSchema = z
  .object({
    locationId: z.string(),
  })
  .required();

export type CreateLocationDto = z.infer<typeof createLocationSchema>;

export const getSuggestionLocationSchema = z
  .object({
    input: z.string(),
  })
  .required();

export type GetSuggestLocationDto = z.infer<typeof getSuggestionLocationSchema>;
