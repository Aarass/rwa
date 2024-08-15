import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { exhaustMap, map } from 'rxjs';
import { SurfaceService } from '../services/surface/surface.service';
import {
  createSurface,
  createSurfaceSuccess,
  deleteSurface,
  loadAllSurfaces,
  loadAllSurfacesSuccess,
} from './surface.actions';

@Injectable()
export class SurfaceEffects {
  constructor(
    private actions$: Actions,
    private surfaceService: SurfaceService
  ) {}

  loadSurfaces$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(loadAllSurfaces),
      exhaustMap(() => {
        return this.surfaceService.getAllSurfaces().pipe(
          map((data) => {
            return loadAllSurfacesSuccess({ data });
          })
        );
      })
    );
  });

  createSurface$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(createSurface),
      exhaustMap((action) => {
        return this.surfaceService.createSurface(action.data).pipe(
          map((data) => {
            return createSurfaceSuccess({ data });
          })
        );
      })
    );
  });

  deleteSurface$ = createEffect(
    () => {
      return this.actions$.pipe(
        ofType(deleteSurface),
        exhaustMap((action) => {
          return this.surfaceService.deleteSurface(action.id).pipe();
        })
      );
    },
    { dispatch: false }
  );
}
