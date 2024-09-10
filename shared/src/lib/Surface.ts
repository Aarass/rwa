import { z } from 'zod';

export interface SurfaceDto {
  id: number;
  name: string;
}

export const createSurfaceSchema = z
  .object({
    name: z.string().trim().min(1),
  })
  .required();

export type CreateSurfaceDto = z.infer<typeof createSurfaceSchema>;

export const updateSurfaceSchema = z
  .object({
    name: z.string().trim().min(1),
  })
  .required();

export type UpdateSurfaceDto = z.infer<typeof updateSurfaceSchema>;
