import { z } from 'zod';

export const appointmentFiltersSchema = z.object({
  sportId: z.number().nullable(),
  age: z.number().min(0).max(100).nullable(),
  skill: z.number().min(0).max(5).nullable(),
  minDate: z.string().date().nullable(),
  maxDate: z.string().date().nullable(),
  minTime: z.string().time().nullable(),
  maxTime: z.string().time().nullable(),
  maxPrice: z.number().nullable(),
  maxDistance: z.number().nullable(),
  organizerId: z.number().nullable(),
  canceled: z.boolean().nullable(),
  skip: z.number().nullable(),
  take: z.number().nullable(),
});
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
