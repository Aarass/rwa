import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { Store } from '@ngrx/store';
import { AppointmentDto, Role } from '@rwa/shared';
import { ButtonModule } from 'primeng/button';
import { map, Observable } from 'rxjs';
import { AppointmentService } from '../../services/appointment/appointment.service';
import { appointmentFeature } from '../../store/appointment.feature';
import { AppointmentComponent } from '../appointment/appointment.component';
import { CardModule } from 'primeng/card';
import { selectPayload } from '../../../auth/store/auth.feature';

@Component({
  selector: 'app-my-appointments-list',
  standalone: true,
  imports: [
    CommonModule,
    AppointmentComponent,
    ButtonModule,
    RouterModule,
    CardModule,
  ],
  templateUrl: './my-appointments-list.component.html',
  styleUrl: './my-appointments-list.component.scss',
})
export class MyAppointmentsListComponent {
  appointments$: Observable<AppointmentDto[]>;

  userId: Observable<number | null>;

  constructor(private store: Store) {
    this.appointments$ = this.store.select(
      appointmentFeature.selectMyAppointments
    );

    this.userId = selectPayload(store).pipe(
      map((payload) => {
        if (payload == null) {
          return null;
        }
        return payload.user.id;
      })
    );
  }
}
