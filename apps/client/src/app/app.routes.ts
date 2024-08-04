import { Route } from '@angular/router';
import { HomeComponent } from './features/home/components/home/home.component';
import { ProfileComponent } from './features/profile/components/profile/profile.component';
import { LoginComponent } from './features/auth/components/login/login.component';
import { RegisterComponent } from './features/auth/components/register/register.component';
import { AuthComponent } from './features/auth/components/auth/auth.component';
export const appRoutes: Route[] = [
  {
    path: '',
    component: HomeComponent,
  },
  {
    path: 'profile',
    component: ProfileComponent,
  },
  // {
  //   path: 'auth',
  //   component: AuthComponent,
  //   children: [
  //     {
  //       path: 'login',
  //       component: LoginComponent,
  //     },
  {
    path: 'register',
    component: RegisterComponent,
  },
  //   ],
  // },
];
