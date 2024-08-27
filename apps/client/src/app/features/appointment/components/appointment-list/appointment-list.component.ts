import { CommonModule } from '@angular/common';
import { Component, OnDestroy } from '@angular/core';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { Store } from '@ngrx/store';
import { AppointmentDto } from '@rwa/shared';
import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';
import { OverlayPanelModule } from 'primeng/overlaypanel';
import { ScrollTopModule } from 'primeng/scrolltop';
import {
  combineLatest,
  map,
  Observable,
  of,
  Subject,
  switchMap,
  takeUntil,
} from 'rxjs';
import { selectPayload } from '../../../auth/store/auth.feature';
import { FiltersComponent } from '../../../filters/components/filters/filters.component';
import {
  loadAppointments,
  reloadAppointments,
} from '../../store/appointment.actions';
import { appointmentFeature } from '../../store/appointment.feature';
import { AppointmentComponent } from '../appointment/appointment.component';
import { filtersChanged } from '../../../filters/store/filter.actions';

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

  queriedUserId$: Observable<number | null>;
  appointments$: Observable<AppointmentDto[]>;

  loading: boolean = false;

  constructor(private store: Store, private route: ActivatedRoute) {
    this.store
      .select(appointmentFeature.selectIsLoading)
      .pipe(takeUntil(this.death))
      .subscribe((val) => {
        this.loading = val.val;
      });

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

    const viewerId$ = selectPayload(this.store).pipe(
      map((payload) => (payload == null ? null : payload.user.id))
    );

    // viewerId$.pipe(takeUntil(this.death)).subscribe((viewerId) => {
    //   alert(viewerId);
    //   this.viewerId = viewerId;
    // });

    this.appointments$ = combineLatest([this.queriedUserId$, viewerId$]).pipe(
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
      })
    );
  }

  ngOnDestroy(): void {
    this.death.next();
    this.death.complete();
  }

  canLoadMore(): boolean {
    return true;
  }

  refresh() {
    this.store.dispatch(reloadAppointments());
  }

  loadMore() {
    this.loading = true;
    this.store.dispatch(loadAppointments());
  }
}
