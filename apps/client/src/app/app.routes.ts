import { inject } from '@angular/core';
import { GuardResult, Route } from '@angular/router';
import { Store } from '@ngrx/store';
import { firstValueFrom, map, Observable, tap } from 'rxjs';
import { DashboardComponent } from './features/admin/components/dashboard/dashboard.component';
import { ImagesComponent } from './features/admin/components/images/images.component';
import { RegisterComponent } from './features/auth/components/register/register.component';
import { authFeature } from './features/auth/store/auth.feature';
import { HomeComponent } from './features/home/components/home/home.component';
import { ProfileComponent } from './features/profile/components/profile/profile.component';
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
  return store
    .select(authFeature.selectAccessToken)
    .pipe(map((val) => val != null));
}

function ifIsNotLoggedIn(): Observable<boolean> {
  return ifIsLoggedIn().pipe(map((val) => !val));
}

function ifIsAdmin(): Observable<boolean> {
  const store = inject(Store);
  return store.select(authFeature.selectDecodedPayload).pipe(
    map((payload) => {
      if (payload == null) {
        return false;
      }
      return payload.user.roles.includes('admin');
    })
  );
}
