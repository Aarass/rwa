import { createFeature, createReducer, on } from '@ngrx/store';
import { UserConfigurableFilters } from '../interfaces/filters';
import { filtersChanged } from './filter.actions';

const initialState = {
  filters: {
    maxDistance: null,
    maxPrice: null,
    maxTime: null,
    minDate: null,
    minTime: null,
    sportId: null,
  } as UserConfigurableFilters,
};

export const filtersFeature = createFeature({
  name: 'filters',
  reducer: createReducer(
    initialState,
    on(filtersChanged, (state, action) => {
      return {
        filters: action.data,
      };
    })
  ),
});
