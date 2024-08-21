import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { Store } from '@ngrx/store';
import { AppointmentDto } from '@rwa/shared';
import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';
import { OverlayPanelModule } from 'primeng/overlaypanel';
import { ScrollTopModule } from 'primeng/scrolltop';
import { combineLatest, map, Observable, of, switchMap, tap } from 'rxjs';
import { selectPayload } from '../../../auth/store/auth.feature';
import { FiltersComponent } from '../../../filters/components/filters/filters.component';
import { appointmentFeature } from '../../store/appointment.feature';
import { AppointmentComponent } from '../appointment/appointment.component';
import { loadAppointments } from '../../store/appointment.actions';

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
export class AppointmentListComponent {
  appointments$: Observable<AppointmentDto[]>;
  viewerId$: Observable<number | null>;
  queriedUserId$: Observable<number | null>;

  loading: boolean = false;

  constructor(private store: Store, private route: ActivatedRoute) {
    this.queriedUserId$ = this.route.queryParamMap.pipe(
      map((map) => {
        const id = map.get('userId');
        if (id == null) {
          return null;
        }
        try {
          return parseInt(id);
        } catch {
          return null;
        }
      })
    );

    this.viewerId$ = selectPayload(this.store).pipe(
      map((payload) => (payload == null ? null : payload.user.id))
    );

    this.appointments$ = combineLatest([
      this.queriedUserId$,
      this.viewerId$,
    ]).pipe(
      tap((val) => console.log(val)),
      switchMap((val) => {
        const [queriedUserId, viewerId] = val;

        if (
          queriedUserId != null &&
          viewerId != null &&
          queriedUserId == viewerId
        ) {
          return this.store.select(appointmentFeature.selectMyAppointments);
        }

        if (queriedUserId == null) {
          return this.store.select(appointmentFeature.selectAllAppointments);
        }

        return of([]);
      }),
      tap(() => (this.loading = false))
    );
  }

  canLoadMore(): boolean {
    return true;
  }

  loadMore() {
    this.loading = true;
    this.store.dispatch(loadAppointments());
  }
}
