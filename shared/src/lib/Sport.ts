import { z } from 'zod';

export interface SportDto {
  id: number;
  name: string;
  imageName: string;
}

export const createSportSchema = z
  .object({
    name: z.string(),
    imageName: z.string(),
  })
  .required();

export type CreateSportDto = z.infer<typeof createSportSchema>;

export const updateSportSchema = z.object({
  name: z.string().optional(),
  imageName: z.string().optional(),
});

export type UpdateSportDto = z.infer<typeof updateSportSchema>;
