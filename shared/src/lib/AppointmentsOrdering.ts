import { z } from 'zod';

export const appointmentsOrderingSchema = z.object({
  // distance: z.enum(['ASC', 'DESC']),
  // price: z.enum(['ASC', 'DESC']),
  // date: z.enum(['ASC', 'DESC']),
  by: z.enum(['distance', 'price', 'date']),
  direction: z.enum(['ASC', 'DESC']),
});

export type AppointmentsOrdering = z.infer<typeof appointmentsOrderingSchema>;
