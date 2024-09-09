import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { ImageService } from '../services/image/image.service';
import { loadAllImages, loadAllImagesSuccess } from './image.actions';
import { exhaustMap, map } from 'rxjs';

@Injectable()
export class ImageEffects {
  constructor(private actions$: Actions, private imageService: ImageService) {}

  // loadAllImages$ = createEffect(() => {
  //   return this.actions$.pipe(
  //     ofType(loadAllImages),
  //     exhaustMap(() => {
  //       return this.imageService.getAllImages().pipe(
  //         map((data) => {
  //           return loadAllImagesSuccess({ data });
  //         })
  //       );
  //     })
  //   );
  // });
}
