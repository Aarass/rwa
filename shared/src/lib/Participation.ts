import { z } from 'zod';

export const createParticipationSchema = z
  .object({
    appointmentId: z.number(),
  })
  .required();

export type CreateParticipationDto = z.infer<typeof createParticipationSchema>;
