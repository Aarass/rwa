import { z } from 'zod';

export const createAppointmentSchema = z
  .object({
    location: z.string(),
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
// .required();

export type CreateAppointmentDto = z.infer<typeof createAppointmentSchema>;

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
