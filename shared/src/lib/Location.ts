import { z } from 'zod';

export interface LocationDto {
  id: string;
  name: string;
  lat: string;
  lng: string;
}

export const createLocationSchema = z
  .object({
    locationId: z.string(),
  })
  .required();

export type CreateLocationDto = z.infer<typeof createLocationSchema>;

export const locationSuggestionSchema = z.object({
  description: z.string(),
  place_id: z.string(),
});

export type LocationSuggestionDto = z.infer<typeof locationSuggestionSchema>;
