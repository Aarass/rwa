import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Store } from '@ngrx/store';
import { surfaceFeature } from '../../../surface/store/surface.feature';
import { filter, Subject, switchMap, takeUntil } from 'rxjs';
import { SkeletonModule } from 'primeng/skeleton';
import { sportFeature } from '../../../sport/store/sport.feature';
import { SportDto } from '@rwa/shared';
import { CardModule } from 'primeng/card';
import { ButtonModule } from 'primeng/button';

@Component({
  selector: 'app-create-sport',
  standalone: true,
  imports: [CommonModule, SkeletonModule, CardModule, ButtonModule],
  templateUrl: './create-sport.component.html',
  styleUrl: './create-sport.component.scss',
})
export class CreateSportComponent implements OnInit {
  death = new Subject<void>();

  count: number | null = null;
  sports: SportDto[] = [];

  constructor(private store: Store) {}

  ngOnInit(): void {
    this.store
      .select(sportFeature.selectIsLoaded)
      .pipe(
        takeUntil(this.death),
        filter((loaded) => loaded == true),
        switchMap(() => {
          return this.store.select(sportFeature.selectCount);
        })
      )
      .subscribe((count) => {
        this.count = count;
      });

    this.store
      .select(sportFeature.selectAllSports)
      .pipe(takeUntil(this.death))
      .subscribe((sports) => {
        this.sports = sports;
      });
  }
}
