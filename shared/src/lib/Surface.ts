import { z } from 'zod';

export interface SurfaceDto {
  id: number;
  name: string;
}

export const createSurfaceSchema = z
  .object({
    name: z.string(),
  })
  .required();

export type CreateSurfaceDto = z.infer<typeof createSurfaceSchema>;
