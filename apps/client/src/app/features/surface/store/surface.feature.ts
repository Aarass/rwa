import { createEntityAdapter } from '@ngrx/entity';
import { createFeature, createReducer, createSelector, on } from '@ngrx/store';
import { SurfaceDto } from '@rwa/shared';
import {
  createSurfaceSuccess,
  deleteSurfaceSuccess,
  loadAllSurfacesSuccess,
} from './surface.actions';

const adapter = createEntityAdapter<SurfaceDto>();

export const surfaceFeature = createFeature({
  name: 'surface',
  reducer: createReducer(
    adapter.getInitialState({
      isLoaded: false,
    }),
    on(loadAllSurfacesSuccess, (state, action) => {
      return {
        ...adapter.addMany(action.data, state),
        isLoaded: true,
      };
    }),
    on(createSurfaceSuccess, (state, action) => {
      return adapter.addOne(action.data, state);
    }),
    on(deleteSurfaceSuccess, (state, action) => {
      return adapter.removeOne(action.id, state);
    })
  ),
  extraSelectors: ({ selectSurfaceState }) => {
    const selectAll = createSelector(selectSurfaceState, (state) =>
      adapter.getSelectors().selectAll(state)
    );

    const selectCount = createSelector(selectSurfaceState, (state) =>
      adapter.getSelectors().selectTotal(state)
    );

    return { selectAll, selectCount };
  },
});
