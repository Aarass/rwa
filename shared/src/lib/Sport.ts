import { z } from 'zod';

export interface SportDto {
  id: number;
  name: string;
  iconUrl: string;
  imageUrl: string;
}

export const createSportSchema = z
  .object({
    name: z.string(),
    iconUrl: z.string(),
    imageUrl: z.string(),
  })
  .required();

export type CreateSportDto = z.infer<typeof createSportSchema>;
