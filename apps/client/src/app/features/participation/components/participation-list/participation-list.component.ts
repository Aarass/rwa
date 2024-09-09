import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { ParticipationDto } from '@rwa/shared';
import { participationFeature } from '../../store/participation.feature';
import { ParticipationComponent } from '../participation/participation.component';

@Component({
  selector: 'app-participation-list',
  standalone: true,
  imports: [CommonModule, ParticipationComponent],
  templateUrl: './participation-list.component.html',
  styleUrl: './participation-list.component.scss',
})
export class ParticipationListComponent {
  participations$: Observable<ParticipationDto[]>;
  constructor(private store: Store) {
    this.participations$ = this.store.select(participationFeature.selectAll);
  }
}
