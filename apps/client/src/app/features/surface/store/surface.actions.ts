import { createAction, props } from '@ngrx/store';
import { CreateSurfaceDto, SurfaceDto } from '@rwa/shared';

export const loadAllSurfaces = createAction('[Surface] Load All Surfaces');
export const loadAllSurfacesSuccess = createAction(
  '[Surface] Load All Surfaces Success',
  props<{ data: SurfaceDto[] }>()
);

export const createSurface = createAction(
  '[Surface] Create Surface',
  props<{ data: CreateSurfaceDto }>()
);
export const createSurfaceSuccess = createAction(
  '[Surface] Create Surface Success',
  props<{ data: SurfaceDto }>()
);

export const deleteSurface = createAction(
  '[Surface] Delete Surface',
  props<{ id: number }>()
);
