import { CommonModule } from '@angular/common';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Store } from '@ngrx/store';
import { SportDto } from '@rwa/shared';
import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';
import { FileUploadModule } from 'primeng/fileupload';
import { InplaceModule } from 'primeng/inplace';
import { InputGroupModule } from 'primeng/inputgroup';
import { InputTextModule } from 'primeng/inputtext';
import { SkeletonModule } from 'primeng/skeleton';
import { filter, firstValueFrom, Subject, switchMap, takeUntil } from 'rxjs';
import { ConfigService } from '../../../global/services/config/config.service';
import { ImageService } from '../../../image/services/image/image.service';
import { SportComponent } from '../../../sport/components/sport/sport.component';
import { createSport } from '../../../sport/store/sport.actions';
import { sportFeature } from '../../../sport/store/sport.feature';

@Component({
  selector: 'app-create-sport',
  standalone: true,
  imports: [
    CommonModule,
    SkeletonModule,
    CardModule,
    ButtonModule,
    InputTextModule,
    FileUploadModule,
    FormsModule,
    InplaceModule,
    InputGroupModule,
    SportComponent,
  ],
  templateUrl: './create-sport.component.html',
  styleUrl: './create-sport.component.scss',
})
export class CreateSportComponent implements OnInit, OnDestroy {
  death = new Subject<void>();

  image: File | null = null;
  src = '';

  sportName = '';

  count: number | null = null;
  sports: SportDto[] = [];

  constructor(
    private store: Store,
    private confingService: ConfigService,
    private imageService: ImageService
  ) {}

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

  ngOnDestroy(): void {
    this.death.next();
    this.death.complete();
  }

  imageSelected(event: Event) {
    if (event.target === null) throw `Unexpected error`;

    const file = (event.target as HTMLInputElement).files?.[0];
    if (file != undefined) {
      this.image = file;
      this.src = URL.createObjectURL(file);
    }
  }

  clearImage() {
    this.image = null;
    this.src = '';
  }

  async createSport() {
    if (this.image == null || this.sportName.length == 0) {
      return;
    }

    const { name: imageName } = await firstValueFrom(
      this.imageService.uploadImage(this.image)
    );

    this.store.dispatch(
      createSport({
        data: {
          name: this.sportName,
          imageName: `${this.confingService.getBackendBaseURL()}/images/${imageName}`,
        },
      })
    );

    this.clearImage();
    this.sportName = '';
  }
}
