import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { Store } from '@ngrx/store';
import { AppointmentDto } from '@rwa/shared';
import { ButtonModule } from 'primeng/button';
import { Observable } from 'rxjs';
import { AppointmentService } from '../../services/appointment/appointment.service';
import { appointmentFeature } from '../../store/appointment.feature';
import { AppointmentComponent } from '../appointment/appointment.component';

@Component({
  selector: 'app-my-appointments-list',
  standalone: true,
  imports: [CommonModule, AppointmentComponent, ButtonModule, RouterModule],
  templateUrl: './my-appointments-list.component.html',
  styleUrl: './my-appointments-list.component.scss',
})
export class MyAppointmentsListComponent {
  appointments$: Observable<AppointmentDto[]>;

  constructor(private store: Store) {
    this.appointments$ = this.store.select(
      appointmentFeature.selectAllMyAppointments
    );
  }
}
