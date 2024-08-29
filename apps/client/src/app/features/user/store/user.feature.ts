import { createFeature, createReducer, on, Store } from '@ngrx/store';
import { UserDto } from '@rwa/shared';
import { loadMeSuccess, setImage } from './user.actions';
import { filter, map } from 'rxjs';

export const userFeature = createFeature({
  name: 'user',
  reducer: createReducer(
    {
      me: null as UserDto | null,
      isSet: false,
    },
    on(loadMeSuccess, (state, action) => {
      return {
        me: action.data,
        isSet: true,
      };
    }),
    on(setImage, (state, action) => {
      if (state.me == null) {
        throw `This should not happen`;
      }

      return {
        ...state,
        me: {
          ...state.me,
          imageName: action.name,
        },
      };
    })
  ),
});

export function selectUser(store: Store) {
  return store.select(userFeature.selectUserState).pipe(
    filter((state) => state.isSet),
    map((state) => state.me)
  );
}
