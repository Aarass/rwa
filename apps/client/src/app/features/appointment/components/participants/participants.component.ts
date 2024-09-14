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
import { map, Observable, of, switchMap } from 'rxjs';
import { selectPayload } from '../../../auth/store/auth.feature';
import { ParticipationsSidebarService } from '../../../participation/services/participations-sidebar/participations-sidebar.service';
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

  constructor(
    private store: Store,
    private router: Router,
    private participationSidebarService: ParticipationsSidebarService
  ) {
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
    this.participationSidebarService.close();
  }

  showAppointment(appointment: AppointmentDto) {
    this.router.navigateByUrl(`appointment?id=${appointment.id}`);
    this.participationSidebarService.close();
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
