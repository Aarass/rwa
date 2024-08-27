import { inject } from '@angular/core';
import { Route } from '@angular/router';
import { Store } from '@ngrx/store';
import { filter, map, Observable, tap } from 'rxjs';
import { DashboardComponent } from './features/admin/components/dashboard/dashboard.component';
import { ImagesComponent } from './features/admin/components/images/images.component';
import { AppointmentFormComponent } from './features/appointment/components/appointment-form/appointment-form.component';
import { AppointmentListComponent } from './features/appointment/components/appointment-list/appointment-list.component';
import { MyAppointmentsListComponent } from './features/appointment/components/my-appointments-list/my-appointments-list.component';
import { ParticipationListComponent } from './features/participation/components/participation-list/participation-list.component';
import { RegisterComponent } from './features/auth/components/register/register.component';
import { authFeature } from './features/auth/store/auth.feature';
import { AuthStatus } from './features/auth/store/auth.state';
import { HomeComponent } from './features/home/components/home/home.component';
import { ProfileComponent } from './features/profile/components/profile/profile.component';
import { UpsListComponent } from './features/ups/components/ups-list/ups-list.component';
import { UserInfoComponent } from './features/user/components/user-info/user-info.component';
import { SingleAppointmentComponent } from './features/appointment/components/single-appointment/single-appointment.component';
export const appRoutes: Route[] = [
  {
    path: '',
    component: HomeComponent,
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
  },
  {
    path: 'appointment-form',
    component: AppointmentFormComponent,
    canActivate: [ifIsLoggedIn],
  },
  {
    path: 'my-appointments',
    component: MyAppointmentsListComponent,
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
    canActivate: [ifIsNotLoggedIn],
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

function ifIsLoggedIn(): Observable<boolean> {
  const store = inject(Store);
  return store.select(authFeature.selectStatus).pipe(
    filter((val) => val != null),
    map((val) => val == AuthStatus.LoggedIn)
  );
}

function ifIsNotLoggedIn(): Observable<boolean> {
  return ifIsLoggedIn().pipe(map((val) => !val));
}

function ifIsAdmin(): Observable<boolean> {
  const store = inject(Store);

  return store.select(authFeature.selectAuthState).pipe(
    filter((state) => {
      return state.status != null;
    }),
    map((state) => {
      const payload = state.decodedPayload;
      if (payload == null) {
        return false;
      }
      return payload.user.roles.includes('admin');
    })
  );
}
