import { z } from 'zod';
import { updateAppointmentSchema } from './Appointment';

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

export const updateSurfaceSchema = z
  .object({
    name: z.string(),
  })
  .required();

export type UpdateSurfaceDto = z.infer<typeof updateSurfaceSchema>;
