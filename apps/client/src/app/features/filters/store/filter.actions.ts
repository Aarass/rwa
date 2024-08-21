import { createAction, props } from '@ngrx/store';
import { UserConfigurableFilters } from '../interfaces/filters';

export const filtersChanged = createAction(
  '[Appointment] Filters Changed',
  props<{ data: UserConfigurableFilters }>()
);
