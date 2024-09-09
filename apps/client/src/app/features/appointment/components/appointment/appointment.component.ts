import { CommonModule } from '@angular/common';
import { Component, Input, OnChanges } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { Store } from '@ngrx/store';
import { AppointmentDto, ParticipationDto } from '@rwa/shared';
import { ConfirmationService } from 'primeng/api';
import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';
import { DialogModule } from 'primeng/dialog';
import { OverlayPanelModule } from 'primeng/overlaypanel';
import { map } from 'rxjs';
import { selectPayload } from '../../../auth/store/auth.feature';
import { toPostgresIntervalString } from '../../../global/functions/date-utility';
import { ConfigService } from '../../../global/services/config/config.service';
import {
  joinAppointment,
  leaveAppointment,
  showParticipants,
} from '../../../participation/store/participation.actions';
import { cancelAppointment } from '../../store/appointment.actions';

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

  @Input()
  showFocusButton!: boolean;

  viewerId: number | null = null;

  additionalInfoVisible = false;

  isHovering = false;
  isJoined = false;
  isRejected = false;

  participation: ParticipationDto | undefined;

  constructor(
    private store: Store,
    private router: Router,
    // private activatedRoute: ActivatedRoute,
    private configService: ConfigService,
    private confirmationService: ConfirmationService
  ) {
    selectPayload(this.store)
      .pipe(map((payload) => payload?.user.id ?? null))
      .subscribe((val) => {
        this.viewerId = val;
        this.check();
      });

    // const urlSegments = this.activatedRoute.snapshot.url;
    // if (urlSegments.length > 0) {
    //   const path = urlSegments[0].path;
    //   console.log(path);
    // }
  }

  ngOnChanges(): void {
    this.check();
  }

  private check() {
    if (this.viewerId === null) {
      this.isJoined = false;
    } else if (this.appointment) {
      this.participation = this.appointment.participants.find(
        (participation) => participation.userId === this.viewerId
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
    return toPostgresIntervalString(this.appointment.duration);
  }

  getJoinedCount() {
    return (
      this.appointment.totalPlayers -
      this.appointment.missingPlayers +
      this.appointment.participants.filter((p) => p.approved === true).length
    );
  }

  mouseenter() {
    this.isHovering = true;
  }
  mouseleave() {
    this.isHovering = false;
  }

  click() {
    if (this.viewerId === null) {
      return;
    }

    if (this.isJoined) {
      if (this.participation === undefined) throw `This should not happen`;
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

  cancelAppointment() {
    this.confirmationService.confirm({
      header: 'Cancel an appointment',
      message: 'Are you sure you want to cancel this appointment?',
      acceptButtonStyleClass: 'p-button-danger p-button-text',
      rejectButtonStyleClass: 'p-button-text p-button-text',
      dismissableMask: true,
      accept: () => {
        this.store.dispatch(
          cancelAppointment({
            data: this.appointment,
          })
        );
      },
    });
    console.log('after');
  }

  showParticipants() {
    this.store.dispatch(showParticipants({ data: this.appointment }));
  }

  toggleAdditionalInfo() {
    this.additionalInfoVisible = !this.additionalInfoVisible;
  }

  getDate() {
    return new Date(this.appointment.date)
      .toDateString()
      .split(' ')
      .slice(1)
      .join(' ');
  }

  getTime() {
    return this.appointment.startTime.split(':').slice(0, 2).join(':');
  }

  nameClick() {
    this.router.navigateByUrl(`user?id=${this.appointment.organizerId}`);
  }

  getImageUrl() {
    return `${this.configService.getBackendBaseURL()}/images/${
      this.appointment.sport.imageName
    }`;
  }

  showSingle() {
    this.router.navigateByUrl(`appointment?id=${this.appointment.id}`);
  }
}
