import { CommonModule } from '@angular/common';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { ButtonModule } from 'primeng/button';
import { InputGroupModule } from 'primeng/inputgroup';
import { SkeletonModule } from 'primeng/skeleton';
import { InputGroupAddonModule } from 'primeng/inputgroupaddon';
import { filter, Subject, switchMap, take, takeUntil } from 'rxjs';
import { surfaceFeature } from '../../../surface/store/surface.feature';
import { SurfaceDto } from '@rwa/shared';
import { FormsModule } from '@angular/forms';
import { InputTextModule } from 'primeng/inputtext';
import {
  createSurface,
  deleteSurface,
} from '../../../surface/store/surface.actions';

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
  ],
  templateUrl: './create-surface.component.html',
  styleUrl: './create-surface.component.scss',
})
export class CreateSurfaceComponent implements OnInit, OnDestroy {
  death = new Subject<void>();

  surfaces: SurfaceDto[] | null = null;

  newSurfaceName: string = '';

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

  deleteSurface(id: number) {
    this.store.dispatch(deleteSurface({ id }));
  }
}
