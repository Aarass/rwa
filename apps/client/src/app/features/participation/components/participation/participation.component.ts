import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
import { Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { ParticipationDto } from '@rwa/shared';
import { markChangesAsSeen } from '../../store/participation.actions';

@Component({
  selector: 'app-participation',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './participation.component.html',
  styleUrl: './participation.component.scss',
})
export class ParticipationComponent {
  @Input()
  participation!: ParticipationDto;

  constructor(private router: Router, private store: Store) {}

  openAppointment() {
    if (!this.participation.userHasSeenChanges) {
      this.store.dispatch(
        markChangesAsSeen({
          participationId: this.participation.id,
        })
      );
    }
    this.router.navigateByUrl(
      `appointment?id=${this.participation.appointmentId}`
    );
  }

  getDate() {
    return new Date(this.participation.appointment.date)
      .toDateString()
      .split(' ')
      .slice(1)
      .join(' ');
  }

  getTime() {
    return this.participation.appointment.startTime
      .split(':')
      .slice(0, 2)
      .join(':');
  }
}
