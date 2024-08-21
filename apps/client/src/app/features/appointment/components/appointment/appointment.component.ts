import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AppointmentDto } from '@rwa/shared';
import { CardModule } from 'primeng/card';
import { ButtonModule } from 'primeng/button';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-appointment',
  standalone: true,
  imports: [CommonModule, CardModule, ButtonModule, RouterModule],
  templateUrl: './appointment.component.html',
  styleUrl: './appointment.component.scss',
})
export class AppointmentComponent {
  @Input()
  appointment!: AppointmentDto;

  @Input()
  viewerId!: number | null;

  getFormatedDuration() {
    return '3 hours 30 minutes';
  }

  isViewerJoined() {
    if (this.viewerId == null) {
      return false;
    }
    return this.appointment.participants
      .map((p) => p.userId)
      .includes(this.viewerId);
  }
}
