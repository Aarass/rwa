import { CommonModule } from '@angular/common';
import {
  Component,
  Input,
  OnChanges,
  OnInit,
  SimpleChanges,
} from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Store } from '@ngrx/store';
import { UpsDto } from '@rwa/shared';
import { ConfirmationService } from 'primeng/api';
import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';
import { RatingModule, RatingRateEvent } from 'primeng/rating';
import { deleteUps, updateUps } from '../../store/ups.actions';

@Component({
  selector: 'app-ups-list-item',
  standalone: true,
  imports: [CommonModule, CardModule, ButtonModule, RatingModule, FormsModule],
  templateUrl: './ups-list-item.component.html',
  styleUrl: './ups-list-item.component.scss',
})
export class UpsListItemComponent implements OnChanges {
  @Input()
  ups: UpsDto | null | undefined;

  rating: number | null = null;

  constructor(
    private store: Store,
    private confirmationService: ConfirmationService
  ) {}

  ngOnChanges(changes: SimpleChanges): void {
    if (this.ups != undefined && this.ups != null) {
      this.rating = this.ups.selfRatedSkillLevel;
    }
  }

  delete() {
    this.confirmationService.confirm({
      header: 'Delete Confirmation',
      message: 'Are you sure you want to delete this item?',
      acceptButtonStyleClass: 'p-button-danger p-button-text',
      rejectButtonStyleClass: 'p-button-text p-button-text',
      dismissableMask: true,
      accept: () => {
        if (this.ups) {
          this.store.dispatch(deleteUps(this.ups));
        }
      },
    });
  }

  onRate(event: RatingRateEvent) {
    if (this.ups == undefined || this.ups == null)
      throw `This should not happen`;

    const { value } = event;

    if (value != this.ups.selfRatedSkillLevel) {
      this.store.dispatch(
        updateUps({
          data: {
            id: this.ups.id,
            changes: {
              selfRatedSkillLevel: value,
            },
          },
        })
      );
    }
  }
}
