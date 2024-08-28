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
  | 'canceled'
> & {
  filterByUpses: boolean;
  onlyMine: boolean;
};
