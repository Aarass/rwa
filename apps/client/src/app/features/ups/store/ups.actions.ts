import { createAction, props } from '@ngrx/store';
import { CreateUpsDto, UpdateUpsDto, UpsDto } from '@rwa/shared';

export const loadMyUpses = createAction('[Ups] Load My Upses');
export const loadMyUpsesSuccess = createAction(
  '[Ups] Load My Upses Success',
  props<{ upses: UpsDto[] }>()
);

export const createUps = createAction(
  '[Ups] Create Ups',
  props<{ data: CreateUpsDto }>()
);

export const createUpsSuccess = createAction(
  '[Ups] Create Ups Success',
  props<{ data: UpsDto }>()
);
export const createUpsFail = createAction('[Ups] Create Ups Fail');

export const deleteUps = createAction(
  '[Ups] Delete Ups',
  props<{ id: number }>()
);

export const updateUps = createAction(
  '[Ups] Update Ups',
  props<{
    data: {
      id: number;
      changes: UpdateUpsDto;
    };
  }>()
);
