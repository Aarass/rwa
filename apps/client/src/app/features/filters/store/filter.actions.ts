import { createAction, props } from '@ngrx/store';
import { UserConfigurableFilters } from '../interfaces/filters';
import { AppointmentsOrdering } from '@rwa/shared';

export const filtersChanged = createAction(
  '[Appointment] Filters Changed',
  props<{
    data: {
      filters: UserConfigurableFilters;
      ordering: AppointmentsOrdering | null;
    };
  }>()
);
