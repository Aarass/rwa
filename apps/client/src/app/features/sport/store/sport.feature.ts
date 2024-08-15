import { createEntityAdapter } from '@ngrx/entity';
import { createFeature, createReducer, createSelector, on } from '@ngrx/store';
import { SportDto } from '@rwa/shared';
import { loadAllSportsSuccess } from './sport.actions';

const adapter = createEntityAdapter<SportDto>();

export const sportFeature = createFeature({
  name: 'sport',
  reducer: createReducer(
    adapter.getInitialState({
      isLoaded: false,
    }),
    on(loadAllSportsSuccess, (state, action) => {
      return {
        ...adapter.addMany(action.sports, state),
        isLoaded: true,
      };
    })
  ),
  extraSelectors: ({ selectSportState }) => {
    const selectAllSports = createSelector(selectSportState, (state) =>
      adapter.getSelectors().selectAll(state)
    );

    const selectCount = createSelector(selectSportState, (state) =>
      adapter.getSelectors().selectTotal(state)
    );

    return {
      selectAllSports,
      selectCount,
    };
  },
});
