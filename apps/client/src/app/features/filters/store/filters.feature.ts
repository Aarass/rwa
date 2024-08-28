import { createFeature, createReducer, on } from '@ngrx/store';
import { UserConfigurableFilters } from '../interfaces/filters';
import { filtersChanged } from './filter.actions';
import { AppointmentsOrdering } from '@rwa/shared';

const initialState: {
  filters: UserConfigurableFilters;
  ordering: AppointmentsOrdering | null;
} = {
  filters: {
    maxDistance: null,
    maxPrice: null,
    maxTime: null,
    minDate: null,
    maxDate: null,
    minTime: null,
    sportId: null,
    filterByUpses: true,
    onlyMine: false,
    canceled: false,
  },
  ordering: {
    by: 'date',
    direction: 'ASC',
  },
};

export const filtersFeature = createFeature({
  name: 'filters',
  reducer: createReducer(
    initialState,
    on(filtersChanged, (state, action) => {
      return {
        ...state,
        ...action.data,
      };
    })
  ),
});
