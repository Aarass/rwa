import { AppointmentFilters } from '@rwa/shared';

export type UserConfigurableFilters = ReplaceUndefinedWithNull<
  Pick<
    AppointmentFilters,
    'sportId' | 'minDate' | 'minTime' | 'maxTime' | 'maxPrice' | 'maxDistance'
  >
>;

type ReplaceUndefinedWithNull<T> = {
  [k in keyof T]-?: T[k] | null;
};
