import { Component, OnDestroy, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import {
  exhaustMap,
  filter,
  map,
  Observable,
  of,
  Subject,
  takeUntil,
  tap,
} from 'rxjs';
import { AppointmentComponent } from '../appointment/appointment.component';
import { AppointmentService } from '../../services/appointment/appointment.service';
import { AppointmentDto } from '@rwa/shared';
import { Store } from '@ngrx/store';
import { appointmentFeature } from '../../store/appointment.feature';
import {
  addAppointment,
  removeAppointment,
} from '../../store/appointment.actions';

@Component({
  selector: 'app-single-appointment',
  standalone: true,
  imports: [CommonModule, AppointmentComponent],
  templateUrl: './single-appointment.component.html',
  styleUrl: './single-appointment.component.scss',
})
export class SingleAppointmentComponent implements OnDestroy {
  appointment$: Observable<AppointmentDto>;
  addedAppointment: AppointmentDto | null = null;

  constructor(
    private store: Store,
    private route: ActivatedRoute,
    // private page: Page,
    private appointmentService: AppointmentService
  ) {
    let idtmp = -1;
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
      filter((val) => val != null),
      exhaustMap((id) => {
        idtmp = id!;
        return this.store.select(appointmentFeature.selectAppointmentById(id!));
      }),
      exhaustMap((val) => {
        if (val == undefined) {
          return this.appointmentService.getAppointment(idtmp).pipe(
            tap((appointment) => {
              this.addedAppointment = appointment;
              this.store.dispatch(addAppointment({ data: appointment }));
            })
          );
        } else {
          return of(val);
        }
      })
    );
  }
  ngOnDestroy(): void {
    if (this.addedAppointment) {
      this.store.dispatch(removeAppointment({ id: this.addedAppointment.id }));
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
