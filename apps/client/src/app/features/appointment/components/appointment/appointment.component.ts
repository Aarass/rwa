import {
  Component,
  Input,
  OnChanges,
  OnInit,
  SimpleChanges,
} from '@angular/core';
import { AvatarModule } from 'primeng/avatar';
import { AvatarGroupModule } from 'primeng/avatargroup';
import { CommonModule } from '@angular/common';
import {
  AppointmentDto,
  appointmentsOrderingSchema,
  ParticipationDto,
} from '@rwa/shared';
import { CardModule } from 'primeng/card';
import { SidebarModule } from 'primeng/sidebar';
import { ButtonModule } from 'primeng/button';
import { RouterModule } from '@angular/router';
import { Store } from '@ngrx/store';
import {
  joinAppointment,
  leaveAppointment,
  showParticipants,
} from '../../../participation/store/participation.actions';
import { ParticipationsSidebarService } from '../../../participation/services/participations-sidebar/participations-sidebar.service';

@Component({
  selector: 'app-appointment',
  standalone: true,
  imports: [CommonModule, CardModule, ButtonModule, RouterModule, AvatarModule],
  templateUrl: './appointment.component.html',
  styleUrl: './appointment.component.scss',
})
export class AppointmentComponent implements OnChanges {
  @Input()
  appointment!: AppointmentDto;
  @Input()
  viewerId!: number | null;

  isHovering: boolean = false;
  isJoined: boolean = false;
  participation: ParticipationDto | undefined;

  constructor(private store: Store) {}

  ngOnChanges(changes: SimpleChanges): void {
    if (this.viewerId == null) {
      console.log();
      this.isJoined = false;
    } else {
      this.participation = this.appointment.participants.find(
        (participation) => participation.userId == this.viewerId
      );
      if (this.participation) {
        this.isJoined = true;
      } else {
        this.isJoined = false;
      }
    }
  }

  getFormatedDuration() {
    return '3 hours 30 minutes';
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
      this.store.dispatch(
        leaveAppointment({
          data: {
            appointmentId: this.appointment.id,
            participationId: this.participation!.id,
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

  print(appointment: any) {
    console.log(appointment);
  }
}
