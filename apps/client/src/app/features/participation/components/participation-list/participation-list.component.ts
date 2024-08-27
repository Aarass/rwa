import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Store } from '@ngrx/store';
import { participationFeature } from '../../store/participation.feature';
import { Observable } from 'rxjs';
import { ParticipationDto } from '../../../../../../../../shared/src';
import { ParticipantsComponent } from '../../../appointment/components/participants/participants.component';
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
