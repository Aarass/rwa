import { CommonModule } from '@angular/common';
import { Component, OnDestroy } from '@angular/core';
import { RouterModule } from '@angular/router';
import { Store } from '@ngrx/store';
import { AppointmentDto } from '@rwa/shared';
import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';
import { OverlayPanelModule } from 'primeng/overlaypanel';
import { ScrollTopModule } from 'primeng/scrolltop';
import { Observable, Subject, takeUntil } from 'rxjs';
import { FiltersComponent } from '../../../filters/components/filters/filters.component';
import {
  loadAppointments,
  reloadAppointments,
} from '../../store/appointment.actions';
import { appointmentFeature } from '../../store/appointment.feature';
import { AppointmentComponent } from '../appointment/appointment.component';

@Component({
  selector: 'app-appointment-list',
  standalone: true,
  imports: [
    CommonModule,
    AppointmentComponent,
    ButtonModule,
    RouterModule,
    CardModule,
    OverlayPanelModule,
    FiltersComponent,
    ScrollTopModule,
  ],
  templateUrl: './appointment-list.component.html',
  styleUrl: './appointment-list.component.scss',
})
export class AppointmentListComponent implements OnDestroy {
  death = new Subject<void>();

  appointments$: Observable<AppointmentDto[]>;

  loading: boolean = false;

  constructor(private store: Store) {
    this.store
      .select(appointmentFeature.selectIsLoading)
      .pipe(takeUntil(this.death))
      .subscribe((val) => {
        this.loading = val.val;
      });

    this.appointments$ = this.store.select(
      appointmentFeature.selectAllAppointments
    );
  }

  ngOnDestroy(): void {
    this.death.next();
    this.death.complete();
  }

  reloadAppointments() {
    this.store.dispatch(reloadAppointments());
  }

  loadMoreAppointments() {
    this.loading = true;
    this.store.dispatch(loadAppointments());
  }
}
