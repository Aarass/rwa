import { z } from 'zod';
import { AppointmentDto } from './Appointment';
import { UserDto } from './User';

export interface ParticipationDto {
  id: number;
  approved: boolean;
  userHasSeenChanges: boolean;
  appointmentId: number;
  appointment: AppointmentDto;
  userId: number;
  user: UserDto;
}

export const createParticipationSchema = z
  .object({
    appointmentId: z.number(),
  })
  .required();

export type CreateParticipationDto = z.infer<typeof createParticipationSchema>;
