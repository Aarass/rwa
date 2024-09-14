import { inject } from '@angular/core';
import { GuardResult, Route, Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { filter, map, Observable } from 'rxjs';
import { DashboardComponent } from './features/admin/components/dashboard/dashboard.component';
import { ImagesComponent } from './features/admin/components/images/images.component';
import { AppointmentFormComponent } from './features/appointment/components/appointment-form/appointment-form.component';
import { AppointmentListComponent } from './features/appointment/components/appointment-list/appointment-list.component';
import { SingleAppointmentComponent } from './features/appointment/components/single-appointment/single-appointment.component';
import { RegisterComponent } from './features/auth/components/register/register.component';
import { authFeature } from './features/auth/store/auth.feature';
import { AuthStatus } from './features/auth/store/auth.state';
import { isNotNull } from './features/global/functions/rxjs-filter';
import { HomeComponent } from './features/home/components/home/home.component';
import { ParticipationListComponent } from './features/participation/components/participation-list/participation-list.component';
import { ProfileComponent } from './features/profile/components/profile/profile.component';
import { UpsListComponent } from './features/ups/components/ups-list/ups-list.component';
import { UserInfoComponent } from './features/user/components/user-info/user-info.component';

export const appRoutes: Route[] = [
  {
    path: '',
    component: HomeComponent,
    canActivate: [() => ifIsNotLoggedIn('appointments')],
  },
  {
    path: 'profile',
    component: ProfileComponent,
    canActivate: [ifIsLoggedIn],
  },
  {
    path: 'appointment',
    component: SingleAppointmentComponent,
  },
  {
    path: 'appointments',
    component: AppointmentListComponent,
    // canActivate: [ifIsLoggedIn],
  },
  {
    path: 'appointment-form',
    component: AppointmentFormComponent,
    canActivate: [ifIsLoggedIn],
  },
  {
    path: 'my-participations',
    component: ParticipationListComponent,
    canActivate: [ifIsLoggedIn],
  },
  {
    path: 'user',
    component: UserInfoComponent,
  },
  {
    path: 'my-sports',
    component: UpsListComponent,
    canActivate: [ifIsLoggedIn],
  },
  {
    path: 'signup',
    component: RegisterComponent,
    canActivate: [() => ifIsNotLoggedIn('appointments')],
  },
  {
    path: 'dashboard',
    component: DashboardComponent,
    canActivate: [ifIsAdmin],
  },
  {
    path: 'images',
    component: ImagesComponent,
    canActivate: [ifIsAdmin],
  },
];

function ifIsLoggedIn(): Observable<GuardResult> {
  const store = inject(Store);
  const router = inject(Router);
  return store.select(authFeature.selectStatus).pipe(
    filter(isNotNull),
    map((val) => val === AuthStatus.LoggedIn),
    map((val) => val || router.parseUrl(''))
  );
}

function ifIsNotLoggedIn(elseRedirectTo?: string): Observable<GuardResult> {
  const store = inject(Store);
  const router = inject(Router);
  return store.select(authFeature.selectStatus).pipe(
    filter(isNotNull),
    map((val) => val === AuthStatus.NotLoggedIn),
    map(
      (val) => val || (elseRedirectTo ? router.parseUrl(elseRedirectTo) : false)
    )
  );
}

function ifIsAdmin(): Observable<GuardResult> {
  const store = inject(Store);
  const router = inject(Router);

  return store.select(authFeature.selectAuthState).pipe(
    filter((state) => {
      return state.status != null;
    }),
    map((state) => {
      const payload = state.decodedPayload;
      if (payload === null) {
        return false;
      }
      return payload.user.roles.includes('admin');
    }),
    map((val) => val || router.parseUrl(''))
  );
}
