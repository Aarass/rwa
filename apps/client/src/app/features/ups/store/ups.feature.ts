import { createEntityAdapter, Dictionary } from '@ngrx/entity';
import { createFeature, createReducer, createSelector, on } from '@ngrx/store';
import { SportDto, UpsDto } from '@rwa/shared';
import { sportFeature } from '../../sport/store/sport.feature';
import {
  createUps,
  createUpsFail,
  createUpsSuccess,
  deleteUps,
  loadMyUpses,
  loadMyUpsesSuccess,
  updateUps,
} from './ups.actions';
import { logout } from '../../auth/store/auth.actions';

const adapter = createEntityAdapter<UpsDto>();

export const upsFeature = createFeature({
  name: 'ups',
  reducer: createReducer(
    adapter.getInitialState({
      isLoading: false,
    }),
    on(loadMyUpses, createUps, (state, action) => {
      return {
        ...state,
        isLoading: true,
      };
    }),
    on(loadMyUpsesSuccess, (state, action) => {
      return adapter.addMany(action.upses, adapter.removeAll(state));
    }),
    on(deleteUps, (state, action) => {
      return adapter.removeOne(action.id, state);
    }),
    on(createUpsSuccess, (state, action) => {
      return adapter.addOne(action.data, state);
    }),
    on(updateUps, (state, action) => {
      return adapter.updateOne(action.data, state);
    }),
    on(loadMyUpsesSuccess, createUpsSuccess, createUpsFail, (state, action) => {
      return {
        ...state,
        isLoading: false,
      };
    })
  ),
  extraSelectors: ({ selectUpsState }) => {
    const selectMyUpses = createSelector(selectUpsState, (state) => {
      return adapter.getSelectors().selectAll(state);
    });

    const selectSportsIDontPlay = createSelector(
      sportFeature.selectEntities,
      sportFeature.selectIds,
      selectMyUpses,
      (sportsDic, sportIds, myUpses) => {
        const sportsIPlayDic: Dictionary<SportDto> = {};

        myUpses.forEach((ups) => {
          sportsIPlayDic[ups.sport.id] = sportsDic[ups.sport.id];
        });

        return sportIds
          .filter((id) => sportsIPlayDic[id] == undefined)
          .map((id) => sportsDic[id]!);
      }
    );

    return {
      selectMyUpses,
      selectSportsIDontPlay,
    };
  },
});
