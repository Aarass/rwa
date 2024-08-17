import { createAction, props } from '@ngrx/store';
import { CreateSportDto, SportDto } from '@rwa/shared';

export const loadAllSports = createAction('[Sport] Load All Sports');

export const loadAllSportsSuccess = createAction(
  '[Sport] Load All Sports Success',
  props<{ sports: SportDto[] }>()
);

export const createSport = createAction(
  '[Sport] Create Sport',
  props<{ data: CreateSportDto }>()
);
export const createSportSuccess = createAction(
  '[Sport] Create Sport Success',
  props<{ data: SportDto }>()
);

export const deleteSport = createAction(
  '[Sport] Delete Sport',
  props<{ id: number }>()
);
export const deleteSportSuccess = createAction(
  '[Sport] Delete Sport Succes',
  props<{ id: number }>()
);
