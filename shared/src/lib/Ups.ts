import { z } from 'zod';
import { SportDto } from './Sport';

export interface UpsDto {
  id: number;
  selfRatedSkillLevel: number;
  sport: SportDto;
}

export const createUpsSchema = z
  .object({
    sportId: z.number(),
    selfRatedSkillLevel: z.number().min(1).max(5),
  })
  .required();

export type CreateUpsDto = z.infer<typeof createUpsSchema>;
