import { Route } from '@angular/router';
import { RegisterComponent } from './features/auth/components/register/register.component';
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
  },
  {
    path: 'signup',
    component: RegisterComponent,
  },
];
