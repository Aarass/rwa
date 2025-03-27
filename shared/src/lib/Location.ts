import { string, z } from 'zod';

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
  id: z.string(),
  display_name: z.string(),
});

export type LocationSuggestionDto = z.infer<typeof locationSuggestionSchema>;
