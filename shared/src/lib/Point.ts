import { z } from 'zod';

export const geoPointSchema = z
  .object({
    lat: z.string(),
    lng: z.string(),
  })
  .required();

export type GeoPointDto = z.infer<typeof geoPointSchema>;
