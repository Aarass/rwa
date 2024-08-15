import { inject } from '@angular/core';
import { Route } from '@angular/router';
import { Store } from '@ngrx/store';
import { DashboardComponent } from './features/admin/components/dashboard/dashboard.component';
import { RegisterComponent } from './features/auth/components/register/register.component';
import { HomeComponent } from './features/home/components/home/home.component';
import { ProfileComponent } from './features/profile/components/profile/profile.component';
import { authFeature } from './features/auth/store/auth.feature';
import { filter, map, take } from 'rxjs';
export const appRoutes: Route[] = [
  {
    path: '',
    component: HomeComponent,
  },
  {
    path: 'profile',
    component: ProfileComponent,
  },
  {
    path: 'signup',
    component: RegisterComponent,
  },
  {
    path: 'dashboard',
    component: DashboardComponent,
    canActivate: [
      () => {
        const store = inject(Store);
        return store.select(authFeature.selectDecodedPayload).pipe(
          filter((val) => val != null),
          take(1),
          map((payload) => {
            return payload!.user.roles.includes('admin');
          })
        );
      },
    ],
  },
];
