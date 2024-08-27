import { Component, Input, OnChanges } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  AccessTokenPayload,
  AppointmentDto,
  ParticipationDto,
  toPostgresString,
} from '@rwa/shared';
import { CardModule } from 'primeng/card';
import { ButtonModule } from 'primeng/button';
import { RouterModule } from '@angular/router';
import { Store } from '@ngrx/store';
import {
  joinAppointment,
  leaveAppointment,
  showParticipants,
} from '../../../participation/store/participation.actions';
import { OverlayPanelModule } from 'primeng/overlaypanel';
import { DialogModule } from 'primeng/dialog';
import { selectPayload } from '../../../auth/store/auth.feature';
import { map, Observable } from 'rxjs';

@Component({
  selector: 'app-appointment',
  standalone: true,
  imports: [
    CommonModule,
    CardModule,
    ButtonModule,
    RouterModule,
    OverlayPanelModule,
    DialogModule,
  ],
  templateUrl: './appointment.component.html',
  styleUrl: './appointment.component.scss',
})
export class AppointmentComponent implements OnChanges {
  @Input()
  appointment!: AppointmentDto;

  viewerId: number | null = null;

  additionalInfoVisible = false;

  isHovering = false;
  isJoined = false;
  isRejected = false;

  participation: ParticipationDto | undefined;

  constructor(private store: Store) {
    selectPayload(this.store)
      .pipe(map((payload) => payload?.user.id ?? null))
      .subscribe((val) => {
        this.viewerId = val;
        this.check();
      });
  }

  ngOnChanges(): void {
    this.check();
  }

  private check() {
    if (this.viewerId == null) {
      this.isJoined = false;
    } else if (this.appointment) {
      this.participation = this.appointment.participants.find(
        (participation) => participation.userId == this.viewerId
      );
      if (this.participation) {
        this.isJoined = true;
        if (this.participation.approved) {
          this.isRejected = false;
        } else {
          this.isRejected = true;
        }
      } else {
        this.isJoined = false;
      }
    }
  }

  getFormatedDuration() {
    return toPostgresString(this.appointment.duration);
  }

  getJoinedCount() {
    return (
      this.appointment.totalPlayers -
      this.appointment.missingPlayers +
      this.appointment.participants.filter((p) => p.approved == true).length
    );
  }

  mouseenter() {
    this.isHovering = true;
  }
  mouseleave() {
    this.isHovering = false;
  }

  click() {
    if (this.viewerId == null) {
      return;
    }

    if (this.isJoined) {
      if (this.participation == undefined) throw `This should not happen`;
      this.store.dispatch(
        leaveAppointment({
          data: {
            appointmentId: this.appointment.id,
            participationId: this.participation.id,
            userId: this.viewerId,
          },
        })
      );
    } else {
      this.store.dispatch(
        joinAppointment({
          appointmentId: this.appointment.id,
        })
      );
    }
  }

  showParticipants() {
    this.store.dispatch(showParticipants({ data: this.appointment }));
  }

  toggleAdditionalInfo() {
    this.additionalInfoVisible = !this.additionalInfoVisible;
  }

  print(appointment: any) {
    console.log(appointment);
  }
}
