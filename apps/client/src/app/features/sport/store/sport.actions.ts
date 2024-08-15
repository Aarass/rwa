import { createAction, props } from '@ngrx/store';
import { SportDto } from '@rwa/shared';

export const loadAllSports = createAction('[Sport] Load All Sports');

export const loadAllSportsSuccess = createAction(
  '[Sport] Load All Sports Success',
  props<{ sports: SportDto[] }>()
);
