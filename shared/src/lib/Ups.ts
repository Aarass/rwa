import { z } from 'zod';

export const createUpsSchema = z
  .object({
    sportId: z.number(),
    selfRatedSkillLevel: z.number().min(1).max(5),
  })
  .required();

export type CreateUpsDto = z.infer<typeof createUpsSchema>;
