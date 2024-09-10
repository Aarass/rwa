import { z } from 'zod';
import { appointmentFiltersSchema } from './AppointmentFilters';
import { appointmentsOrderingSchema } from './AppointmentsOrdering';
import { geoPointSchema } from './Point';
import { SportDto } from './Sport';
import { SurfaceDto } from './Surface';
import { UserDto } from './User';
import { ParticipationDto } from './Participation';
import { LocationDto } from './Location';

export interface AppointmentDto {
  id: number;
  locationId: string;
  location: LocationDto;
  environment: Environment;
  date: string;
  startTime: string;
  duration: IntervalDto;
  totalPlayers: number;
  missingPlayers: number;
  minSkillLevel: number;
  maxSkillLevel: number;
  minAge: number;
  maxAge: number;
  pricePerPlayer: number;
  additionalInformation: string;
  canceled: boolean;
  sportId: number;
  sport: SportDto;
  surfaceId: number;
  surface: SurfaceDto;
  organizerId: number;
  organizer: UserDto;
  participants: ParticipationDto[];
}

const baseAppointmentSchema = z.object({
  locationId: z
    .string({ message: 'You must select a valid location' })
    .trim()
    .min(1),
  date: z.string().trim().min(1), //.date(),
  startTime: z.string().trim().min(1),
  environment: z.number().min(0).max(1),
  duration: z
    .string()
    .trim()
    .min(1)
    .refine((val) => val !== '0', `Appointment duration can't be 0`),
  totalPlayers: z.number().min(2),
  missingPlayers: z.number().min(1),
  minSkillLevel: z.number().min(0).max(5),
  maxSkillLevel: z.number().min(0).max(5),
  minAge: z.number().min(0).max(100),
  maxAge: z.number().min(0).max(100),
  pricePerPlayer: z.number().min(0),
  additionalInformation: z.string(),
  surfaceId: z.number().min(0),
  sportId: z.number().min(0),
});

export const createAppointmentSchema = baseAppointmentSchema.superRefine(
  (dto, ctx) => {
    if (dto.minSkillLevel > dto.maxSkillLevel) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: `Min skill level is bigger than max skill level`,
      });
    }

    if (dto.minAge > dto.maxAge) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: `Min age is bigger than max age`,
      });
    }

    if (dto.totalPlayers < dto.missingPlayers) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: `Can't have more missing than total players`,
      });
    }
  }
);

export const updateAppointmentSchema = baseAppointmentSchema.partial();

export type CreateAppointmentDto = z.infer<typeof createAppointmentSchema>;
export type UpdateAppointmentDto = z.infer<typeof updateAppointmentSchema>;

export const findAppointmentsSchema = z.object({
  filters: appointmentFiltersSchema,
  ordering: appointmentsOrderingSchema.nullable(),
  userLocation: geoPointSchema.nullable(),
});

export type FindAppointmentsDto = z.infer<typeof findAppointmentsSchema>;

export interface IntervalDto {
  hours: number;
  minutes: number;
}

export enum Environment {
  Outdoor,
  Indoor,
}
