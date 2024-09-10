import { CommonModule } from '@angular/common';
import { Component, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Store } from '@ngrx/store';
import { AppointmentDto } from '@rwa/shared';
import { filter, map, Observable, switchMap, tap, withLatestFrom } from 'rxjs';
import {
  isNotNull,
  isNotUndefined,
} from '../../../global/functions/rxjs-filter';
import {
  loadAppointment,
  removeAppointment,
} from '../../store/appointment.actions';
import { appointmentFeature } from '../../store/appointment.feature';
import { AppointmentComponent } from '../appointment/appointment.component';

@Component({
  selector: 'app-single-appointment',
  standalone: true,
  imports: [CommonModule, AppointmentComponent],
  templateUrl: './single-appointment.component.html',
  styleUrl: './single-appointment.component.scss',
})
export class SingleAppointmentComponent implements OnDestroy {
  appointment$: Observable<AppointmentDto>;
  addedAppointmentId: number | null = null;

  constructor(private store: Store, private route: ActivatedRoute) {
    this.appointment$ = this.route.queryParamMap.pipe(
      map((map) => {
        const id = map.get('id');
        if (id === null) {
          return null;
        }
        try {
          return parseInt(id);
        } catch {
          return null;
        }
      }),
      filter(isNotNull),
      switchMap((id) => {
        return this.store.select(appointmentFeature.selectIsLoading).pipe(
          withLatestFrom(
            this.store.select(appointmentFeature.selectAppointmentById(id))
          ),
          filter((tuple) => tuple[0].val == false),
          map((tuple) => tuple[1]),
          tap((val) => {
            if (val === undefined) {
              this.store.dispatch(loadAppointment({ id }));
              this.addedAppointmentId = id;
            }
          })
        );
      }),
      filter(isNotUndefined)
    );
  }

  ngOnDestroy(): void {
    if (this.addedAppointmentId) {
      this.store.dispatch(removeAppointment({ id: this.addedAppointmentId }));
    }
  }
}
