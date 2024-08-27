import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { AppointmentDto, ParticipationDto, UserDto } from '@rwa/shared';
import { AccordionModule } from 'primeng/accordion';
import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';
import { DividerModule } from 'primeng/divider';
import { TagModule } from 'primeng/tag';
import { lastValueFrom, map, Observable, tap } from 'rxjs';
import { rejectParticipation } from '../../../participation/store/participation.actions';
import { participationFeature } from '../../../participation/store/participation.feature';
import { selectPayload } from '../../../auth/store/auth.feature';
import { InplaceModule } from 'primeng/inplace';

@Component({
  selector: 'app-participants',
  standalone: true,
  imports: [
    CommonModule,
    ButtonModule,
    CardModule,
    TagModule,
    AccordionModule,
    DividerModule,
    InplaceModule,
  ],
  templateUrl: './participants.component.html',
  styleUrl: './participants.component.scss',
})
export class ParticipantsComponent {
  appointment$: Observable<AppointmentDto | null>;
  viewerId: number | null = null;

  constructor(private store: Store, private router: Router) {
    this.appointment$ = this.store.select(
      participationFeature.selectSelectedAppointment
    );

    selectPayload(this.store).subscribe((payload) => {
      this.viewerId = payload?.user.id ?? null;
    });
  }

  showUser(userId: number) {
    this.router.navigateByUrl(`user?id=${userId}`);
  }

  getApprovedUsers(appointment: AppointmentDto) {
    return appointment.participants.filter((p) => p.approved);
  }

  getRejectedUsers(appointment: AppointmentDto) {
    return appointment.participants.filter((p) => !p.approved);
  }

  async reject(participation: ParticipationDto, appointment: AppointmentDto) {
    this.store.dispatch(
      rejectParticipation({
        data: {
          appointmentId: appointment.id,
          participationId: participation.id,
          userId: participation.userId,
        },
      })
    );
  }
}
