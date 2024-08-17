import { CommonModule } from '@angular/common';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Store } from '@ngrx/store';
import { SportDto } from '@rwa/shared';
import { ConfirmationService } from 'primeng/api';
import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { FileUploadModule } from 'primeng/fileupload';
import { InputTextModule } from 'primeng/inputtext';
import { SkeletonModule } from 'primeng/skeleton';
import {
  filter,
  firstValueFrom,
  Subject,
  switchMap,
  take,
  takeUntil,
  tap,
} from 'rxjs';
import { ImageService } from '../../../image/services/image/image.service';
import { createSport, deleteSport } from '../../../sport/store/sport.actions';
import { sportFeature } from '../../../sport/store/sport.feature';

@Component({
  selector: 'app-create-sport',
  standalone: true,
  imports: [
    CommonModule,
    SkeletonModule,
    CardModule,
    ButtonModule,
    ConfirmDialogModule,
    InputTextModule,
    FileUploadModule,
    FormsModule,
  ],
  templateUrl: './create-sport.component.html',
  styleUrl: './create-sport.component.scss',
})
export class CreateSportComponent implements OnInit, OnDestroy {
  death = new Subject<void>();

  image: File | null = null;
  src: string = '';

  sportName: string = '';

  count: number | null = null;
  sports: SportDto[] = [];

  constructor(
    private store: Store,
    private confirmationService: ConfirmationService,
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

  onChange(event: any) {
    // console.log(event.target.files);
    const file = event.target.files[0];
    if (file != undefined) {
      this.image = file;
      this.src = URL.createObjectURL(this.image!);
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
          iconUrl: `http://localhost:3000/images/${imageName}`,
          imageUrl: `http://localhost:3000/images/${imageName}`,
        },
      })
    );

    this.clearImage();
    this.sportName = '';
  }

  deleteSport(id: number) {
    this.confirmationService.confirm({
      header: 'Delete Confirmation',
      message: 'Are you sure you want to delete this item?',
      acceptButtonStyleClass: 'p-button-danger p-button-text',
      rejectButtonStyleClass: 'p-button-text p-button-text',
      dismissableMask: true,
      accept: () => {
        this.store.dispatch(deleteSport({ id }));
      },
    });
  }
}
