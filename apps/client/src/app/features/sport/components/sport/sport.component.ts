import { CommonModule } from '@angular/common';
import { Component, Input, OnChanges } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Store } from '@ngrx/store';
import { SportDto } from '@rwa/shared';
import { ConfirmationService } from 'primeng/api';
import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';
import { FileUploadModule } from 'primeng/fileupload';
import { Inplace, InplaceModule } from 'primeng/inplace';
import { InputGroupModule } from 'primeng/inputgroup';
import { InputTextModule } from 'primeng/inputtext';
import { take, tap } from 'rxjs';
import { ConfigService } from '../../../global/services/config/config.service';
import { ImageService } from '../../../image/services/image/image.service';
import { deleteSport, updateSport } from '../../store/sport.actions';

@Component({
  selector: 'app-sport',
  standalone: true,
  imports: [
    CommonModule,
    CardModule,
    ButtonModule,
    InputTextModule,
    FileUploadModule,
    FormsModule,
    InplaceModule,
    InputGroupModule,
    SportComponent,
  ],
  templateUrl: './sport.component.html',
  styleUrl: './sport.component.scss',
})
export class SportComponent implements OnChanges {
  @Input()
  sport!: SportDto;
  imageUrl: string | null = null;

  constructor(
    private store: Store,
    private imageService: ImageService,
    private configService: ConfigService,
    private confirmationService: ConfirmationService
  ) {}

  ngOnChanges(): void {
    if (this.sport != undefined) {
      this.imageUrl = `${this.configService.getBackendBaseURL()}/images/${
        this.sport.imageName
      }`;
    }
  }

  editName(inplace: Inplace, sport: SportDto, input: HTMLInputElement) {
    if (input.value.length) {
      this.store.dispatch(
        updateSport({
          data: {
            id: sport.id,
            dto: {
              name: input.value,
            },
          },
        })
      );
    }

    inplace.deactivate();
  }

  updateImageSelected(event: Event) {
    if (event.target === null) throw `Unexpected error`;

    const file = (event.target as HTMLInputElement).files?.[0];
    if (file != undefined) {
      this.imageUrl = URL.createObjectURL(file);
      this.imageService
        .uploadImage(file)
        .pipe(
          tap((res) => {
            this.store.dispatch(
              updateSport({
                data: {
                  id: this.sport.id,
                  dto: {
                    imageName: res.name,
                  },
                },
              })
            );
          }),
          take(1)
        )
        .subscribe();
    }
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
