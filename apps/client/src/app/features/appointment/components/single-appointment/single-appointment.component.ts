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
        if (id == null) {
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
        return this.store
          .select(appointmentFeature.selectAppointmentById(id))
          .pipe(
            withLatestFrom(
              this.store.select(appointmentFeature.selectIsLoading)
            ),
            filter((tuple) => tuple[1].val != true),
            map((tuple) => tuple[0]),
            tap((val) => {
              if (val == undefined) {
                console.log('Dispatched');
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

  // ngOnInit(): void {
  //   this.page.on('navigatingTo', (data: any) => {
  //     // run init code
  //     // (note: this will run when you either move forward or back to this page)
  //   });

  //   this.page.on('navigatingFrom', (data: any) => {
  //     // run destroy code
  //     // (note: this will run when you either move forward to a new page or back to the previous page)
  //   });
  // }

  // death = new Subject<void>();
  // ngOnDestroy(): void {
  //   this.death.next();
  //   this.death.complete();
  // }
}
