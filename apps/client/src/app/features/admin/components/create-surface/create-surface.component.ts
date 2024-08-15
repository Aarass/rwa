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

@Component({
  selector: 'app-create-surface',
  standalone: true,
  imports: [
    CommonModule,
    InputGroupModule,
    InputGroupAddonModule,
    ButtonModule,
    SkeletonModule,
    FormsModule,
  ],
  templateUrl: './create-surface.component.html',
  styleUrl: './create-surface.component.scss',
})
export class CreateSurfaceComponent implements OnInit, OnDestroy {
  death = new Subject<void>();
  count: number | null = null;
  surfaces: SurfaceDto[] = [];
  name: string = '';

  constructor(private store: Store) {}

  ngOnInit(): void {
    this.store
      .select(surfaceFeature.selectIsLoaded)
      .pipe(
        filter((loaded) => loaded == true),
        take(1),
        switchMap(() => {
          return this.store
            .select(surfaceFeature.selectCount)
            .pipe(takeUntil(this.death));
        })
      )
      .subscribe((count) => {
        this.count = count;
      });

    this.store
      .select(surfaceFeature.selectAll)
      .pipe(takeUntil(this.death))
      .subscribe((surfaces) => (this.surfaces = surfaces));
  }
  createSurface() {
    alert(this.name);
    this.name = '';
  }

  ngOnDestroy(): void {
    this.death.next();
    this.death.complete();
  }
}
