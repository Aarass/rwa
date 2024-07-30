import { z } from 'zod';

export const geoPointSchema = z
  .object({
    lat: z.number(),
    lng: z.number(),
  })
  .required();

export type GeoPointDto = z.infer<typeof geoPointSchema>;
