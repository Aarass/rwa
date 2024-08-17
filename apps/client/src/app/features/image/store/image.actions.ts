import { createAction, props } from '@ngrx/store';
import { ImageDto } from '@rwa/shared';

export const loadAllImages = createAction('[Image] Load All Images');
export const loadAllImagesSuccess = createAction(
  '[Image] Load All Images Succes',
  props<{ data: ImageDto[] }>()
);

export const imageUploaded = createAction(
  '[Image] Image Uploaded',
  props<{ data: ImageDto }>()
);
