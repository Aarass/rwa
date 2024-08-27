import { Component, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { exhaustMap, filter, map, Observable, Subject, takeUntil } from 'rxjs';
import { AppointmentComponent } from '../appointment/appointment.component';
import { AppointmentService } from '../../services/appointment/appointment.service';
import { AppointmentDto } from '@rwa/shared';

@Component({
  selector: 'app-single-appointment',
  standalone: true,
  imports: [CommonModule, AppointmentComponent],
  templateUrl: './single-appointment.component.html',
  styleUrl: './single-appointment.component.scss',
})
export class SingleAppointmentComponent implements OnDestroy {
  death = new Subject<void>();
  appointment: AppointmentDto | null = null;

  constructor(
    private route: ActivatedRoute,
    private appointmentService: AppointmentService
  ) {
    this.route.queryParamMap
      .pipe(
        takeUntil(this.death),
        map((map) => {
          const id = map.get('id');
          if (id == null) {
            return null;
          }
          try {
            return parseInt(id);
          } catch {
            return null;
          }
        }),
        filter((val) => val != null),
        exhaustMap((id) => {
          return this.appointmentService.getAppointment(id!);
        })
      )
      .subscribe((val) => (this.appointment = val));
  }

  ngOnDestroy(): void {
    this.death.next();
    this.death.complete();
  }
}
