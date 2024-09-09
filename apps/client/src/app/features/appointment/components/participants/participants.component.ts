import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { Store } from '@ngrx/store';
import { AppointmentDto, ParticipationDto } from '@rwa/shared';
import { AccordionModule } from 'primeng/accordion';
import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';
import { DividerModule } from 'primeng/divider';
import { InplaceModule } from 'primeng/inplace';
import { PanelModule } from 'primeng/panel';
import { TagModule } from 'primeng/tag';
import { EMPTY, filter, map, Observable, of, switchMap, tap } from 'rxjs';
import { selectPayload } from '../../../auth/store/auth.feature';
import { isNotNull } from '../../../global/functions/rxjs-filter';
import { rejectParticipation } from '../../../participation/store/participation.actions';
import { participationFeature } from '../../../participation/store/participation.feature';
import { appointmentFeature } from '../../store/appointment.feature';

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
    PanelModule,
    RouterModule,
  ],
  templateUrl: './participants.component.html',
  styleUrl: './participants.component.scss',
})
export class ParticipantsComponent {
  appointment$: Observable<AppointmentDto | undefined>;
  viewerId$: Observable<number | null>;

  constructor(private store: Store, private router: Router) {
    this.appointment$ = this.store
      .select(participationFeature.selectSelectedAppointmentId)
      .pipe(
        switchMap((id) => {
          if (id == null) {
            return of(undefined);
          } else {
            return this.store.select(
              appointmentFeature.selectAppointmentById(id)
            );
          }
        })
      );

    this.viewerId$ = selectPayload(this.store).pipe(
      map((payload) => payload?.user.id ?? null)
    );
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
