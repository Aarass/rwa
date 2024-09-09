import { createEntityAdapter } from '@ngrx/entity';
import { createFeature, createReducer, createSelector, on } from '@ngrx/store';
import { imageUploaded } from './image.actions';

const adapter = createEntityAdapter<{ name: string }>();

export const imageState = createFeature({
  name: 'image',
  reducer: createReducer(
    adapter.getInitialState(),
    on(imageUploaded, (state, action) => {
      return adapter.addOne(action.data, state);
    })
  ),
  extraSelectors: ({ selectImageState }) => {
    const selectAll = createSelector(selectImageState, (state) => {
      adapter.getSelectors().selectAll(state);
    });
    return { selectAll };
  },
});
