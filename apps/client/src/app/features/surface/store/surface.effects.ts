import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { catchError, exhaustMap, map, throwError } from 'rxjs';
import { SurfaceService } from '../services/surface/surface.service';
import {
  createSurface,
  createSurfaceSuccess,
  deleteSurface,
  deleteSurfaceSuccess,
  loadAllSurfaces,
  loadAllSurfacesSuccess,
  updateSurface,
} from './surface.actions';
import { MessageService } from 'primeng/api';
import { HttpErrorResponse } from '@angular/common/http';

@Injectable()
export class SurfaceEffects {
  constructor(
    private actions$: Actions,
    private surfaceService: SurfaceService,
    private messageService: MessageService
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

  updateSurface$ = createEffect(
    () => {
      return this.actions$.pipe(
        ofType(updateSurface),
        exhaustMap((action) => {
          return this.surfaceService.updateSurface(
            action.data.id,
            action.data.dto
          );
        })
      );
    },
    { dispatch: false }
  );

  deleteSurface$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(deleteSurface),
      exhaustMap((action) => {
        return this.surfaceService.deleteSurface(action.id).pipe(
          map(() => {
            return deleteSurfaceSuccess({ id: action.id });
          }),
          catchError((err: HttpErrorResponse) => {
            this.messageService.add({
              key: 'global',
              severity: 'error',
              summary: err.error.message,
            });
            return throwError(() => err);
          })
        );
      })
    );
  });
}
