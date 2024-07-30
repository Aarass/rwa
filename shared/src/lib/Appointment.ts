import { z } from 'zod';
import { appointmentFiltersSchema } from './AppointmentFilters';
import { appointmentsOrderingSchema } from './AppointmentsOrdering';
import { geoPointSchema } from './Point';

export const createAppointmentSchema = z.object({
  locationId: z.string(),
  date: z.string().date(),
  startTime: z.string(),
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
    date: z.string().date(),
    startTime: z.string(),
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

export const findAppointmentsSchema = z
  .object({
    filters: appointmentFiltersSchema,
    ordering: appointmentsOrderingSchema,
    userLocation: geoPointSchema,
  })
  .partial();

export type FindAppointmentsDto = z.infer<typeof findAppointmentsSchema>;

// export const createAppointmentSchema = z
//   .object({
//     location: z.string(),
//     date: z.string().date(),
//     startTime: z.string(),
//     duration: z.string(),
//     totalPlayers: z.number(),
//     missingPlayers: z.number(),
//     minSkillLevel: z.number(),
//     maxSkillLevel: z.number(),
//     minAge: z.number(),
//     maxAge: z.number(),
//     pricePerPlayer: z.number(),
//     additionalInformation: z.string(),
//     canceled: z.boolean(),
//     surfaceId: z.number(),
//     sportId: z.number(),
//     organizerId: z.number(),
//     participants: z.number().array(),
//   })
//   .required();
