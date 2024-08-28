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

export const createAppointmentSchema = z.object({
  locationId: z.string(),
  date: z.string(), //.date(),
  startTime: z.string(),
  environment: z.number().min(0).max(1),
  duration: z.string(),
  totalPlayers: z.number(),
  missingPlayers: z.number(),
  minSkillLevel: z.number(),
  maxSkillLevel: z.number(),
  minAge: z.number(),
  maxAge: z.number(),
  pricePerPlayer: z.number(),
  additionalInformation: z.string(),
  surfaceId: z.number(),
  sportId: z.number(),
});

export type CreateAppointmentDto = z.infer<typeof createAppointmentSchema>;

export const updateAppointmentSchema = z
  .object({
    locationId: z.string(),
    date: z.string(), //.date(),
    startTime: z.string(),
    environment: z.number().min(0).max(1),
    duration: z.string(),
    totalPlayers: z.number(),
    missingPlayers: z.number(),
    minSkillLevel: z.number(),
    maxSkillLevel: z.number(),
    minAge: z.number(),
    maxAge: z.number(),
    pricePerPlayer: z.number(),
    additionalInformation: z.string(),
    surfaceId: z.number(),
    sportId: z.number(),
  })
  .partial();

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
