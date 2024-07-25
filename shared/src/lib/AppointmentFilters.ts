import { z } from 'zod';

export const appointmentFiltersSchema = z
  .object({
    sportId: z.number(),
    age: z.number().min(0).max(100),
    skill: z.number().min(0).max(5),
    minDate: z.string().date(),
    maxDate: z.string().date(),
    minTime: z.string().time(),
    maxTime: z.string().time(),
    maxPrice: z.number(),
    distance: z.object({
      maxDistance: z.number(),
      lat: z.number(),
      lng: z.number(),
    }),
    organizerId: z.number(),
    canceled: z.boolean(),
    skip: z.number(),
    take: z.number(),
  })
  .partial();
// .superRefine((data, ctx) => {
//   if (data.minAge && data.maxAge) {
//     if (data.minAge > data.maxAge) {
//       ctx.addIssue({
//         code: z.ZodIssueCode.custom,
//         message: 'Min age greater than max age',
//         fatal: true,
//       });
//     }
//   }

//   if (data.minSkill && data.maxSkill) {
//     if (data.minSkill > data.maxSkill) {
//       ctx.addIssue({
//         code: z.ZodIssueCode.custom,
//         message: 'Min skill greater than max skill',
//         fatal: true,
//       });
//     }
//   }

//   return z.NEVER;
// });

export type AppointmentFilters = z.infer<typeof appointmentFiltersSchema>;
