
import { z } from 'zod';

export const createSurfaceSchema = z
  .object({
    name: z.string(),
  })
  .required();

export type CreateSurfaceDto = z.infer<typeof createSurfaceSchema>;

