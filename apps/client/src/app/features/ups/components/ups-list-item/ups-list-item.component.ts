import { CommonModule } from '@angular/common';
import { Component, Input, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Store } from '@ngrx/store';
import { UpsDto } from '@rwa/shared';
import { ConfirmationService } from 'primeng/api';
import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';
import { RatingModule } from 'primeng/rating';
import { deleteUps } from '../../store/ups.actions';

@Component({
  selector: 'app-ups-list-item',
  standalone: true,
  imports: [CommonModule, CardModule, ButtonModule, RatingModule, FormsModule],
  templateUrl: './ups-list-item.component.html',
  styleUrl: './ups-list-item.component.scss',
})
export class UpsListItemComponent implements OnInit {
  @Input()
  ups: UpsDto | null | undefined;

  constructor(
    private store: Store,
    private confirmationService: ConfirmationService
  ) {}

  ngOnInit(): void {
    console.log(this.ups);
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
}
