import { z } from 'zod';

export interface SportDto {
  id: number;
  name: string;
  imageName: string;
}

export const createSportSchema = z
  .object({
    name: z.string().trim().min(1),
    imageName: z.string().trim().min(1),
  })
  .required();

export type CreateSportDto = z.infer<typeof createSportSchema>;

export const updateSportSchema = z.object({
  name: z.string().trim().min(1).optional(),
  imageName: z.string().trim().min(1).optional(),
});

export type UpdateSportDto = z.infer<typeof updateSportSchema>;
