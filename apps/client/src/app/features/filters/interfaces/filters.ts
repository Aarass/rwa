import { AppointmentFilters } from '@rwa/shared';

export type UserConfigurableFilters = Pick<
  AppointmentFilters,
  | 'sportId'
  | 'minDate'
  | 'maxDate'
  | 'minTime'
  | 'maxTime'
  | 'maxPrice'
  | 'maxDistance'
>;

// type ReplaceUndefinedWithNull<T> = {
//   [k in keyof T]-?: T[k] | null;
// };
