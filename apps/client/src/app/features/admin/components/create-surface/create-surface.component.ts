import { CommonModule } from '@angular/common';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Store } from '@ngrx/store';
import { SurfaceDto } from '@rwa/shared';
import { ButtonModule } from 'primeng/button';
import { Inplace, InplaceModule } from 'primeng/inplace';
import { InputGroupModule } from 'primeng/inputgroup';
import { InputGroupAddonModule } from 'primeng/inputgroupaddon';
import { InputTextModule } from 'primeng/inputtext';
import { SkeletonModule } from 'primeng/skeleton';
import { Subject, takeUntil } from 'rxjs';
import {
  createSurface,
  deleteSurface,
  updateSurface,
} from '../../../surface/store/surface.actions';
import { surfaceFeature } from '../../../surface/store/surface.feature';

@Component({
  selector: 'app-create-surface',
  standalone: true,
  imports: [
    CommonModule,
    InputGroupModule,
    InputGroupAddonModule,
    InputTextModule,
    ButtonModule,
    SkeletonModule,
    FormsModule,
    InplaceModule,
  ],
  templateUrl: './create-surface.component.html',
  styleUrl: './create-surface.component.scss',
})
export class CreateSurfaceComponent implements OnInit, OnDestroy {
  death = new Subject<void>();

  surfaces: SurfaceDto[] | null = null;

  newSurfaceName = '';

  constructor(private store: Store) {}

  ngOnInit(): void {
    this.store
      .select(surfaceFeature.selectAll)
      .pipe(takeUntil(this.death))
      .subscribe((surfaces) => (this.surfaces = surfaces));
  }

  ngOnDestroy(): void {
    this.death.next();
    this.death.complete();
  }

  createSurface() {
    this.store.dispatch(createSurface({ data: { name: this.newSurfaceName } }));
    this.newSurfaceName = '';
  }

  editSurface(inplace: Inplace, surface: SurfaceDto, input: HTMLInputElement) {
    if (input.value.length) {
      this.store.dispatch(
        updateSurface({
          data: {
            id: surface.id,
            dto: { name: input.value },
          },
        })
      );
    }

    inplace.deactivate();
  }

  deleteSurface(id: number) {
    this.store.dispatch(deleteSurface({ id }));
  }
}
