import { CommonModule } from '@angular/common';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { Store } from '@ngrx/store';
import { PrimeNGConfig } from 'primeng/api';
import { BadgeModule } from 'primeng/badge';
import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';
import {
  DialogService,
  DynamicDialogModule,
  DynamicDialogRef,
} from 'primeng/dynamicdialog';
import { InputTextModule } from 'primeng/inputtext';
import { MenubarModule } from 'primeng/menubar';
import { RippleModule } from 'primeng/ripple';
import { ToastModule } from 'primeng/toast';
import { filter, firstValueFrom, Subject, take, takeUntil } from 'rxjs';
import { LoginComponent } from './features/auth/components/login/login.component';
import { refresh } from './features/auth/store/auth.actions';
import { authFeature, selectPayload } from './features/auth/store/auth.feature';
import { AuthStatus } from './features/auth/store/auth.state';
import { ProfileSummaryComponent } from './features/profile/components/profile-summary/profile-summary.component';
import { SidebarComponent } from './features/sidebar/components/sidebar/sidebar.component';
import { loadAllSports } from './features/sport/store/sport.actions';
import { loadAllSurfaces } from './features/surface/store/surface.actions';
import { loadMyUpses } from './features/ups/store/ups.actions';
import {
  loadAppointments,
  loadMyAppointments,
} from './features/appointment/store/appointment.actions';

@Component({
  standalone: true,
  imports: [
    ProfileSummaryComponent,
    RouterModule,
    MenubarModule,
    BadgeModule,
    InputTextModule,
    RippleModule,
    CommonModule,
    ButtonModule,
    DynamicDialogModule,
    LoginComponent,
    ToastModule,
    SidebarComponent,
    CardModule,
  ],
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
})
export class AppComponent implements OnInit, OnDestroy {
  death = new Subject<void>();

  authStatus: AuthStatus | null = null;
  isAdmin: boolean = false;
  singInDialogRef: DynamicDialogRef<LoginComponent> | null = null;

  constructor(
    private primengConfig: PrimeNGConfig,
    private router: Router,
    private store: Store,
    private dialogService: DialogService
  ) {}

  ngOnInit() {
    this.primengConfig.ripple = true;

    this.store
      .select(authFeature.selectStatus)
      .pipe(takeUntil(this.death))
      .subscribe((val) => {
        this.authStatus = val;
        if (val == AuthStatus.LoggedIn) {
          this.closeSignInDialog();
          this.store.dispatch(loadMyUpses());
        }
      });

    this.store
      .select(authFeature.selectDecodedPayload)
      .pipe(
        takeUntil(this.death),
        filter((val) => val != null)
      )
      .subscribe((payload) => {
        this.isAdmin = payload!.user.roles.includes('admin');
      });

    // this.store
    //   .select(authFeature.selectStatus)
    //   .pipe(
    //     filter((val) => val != null),
    //     take(1)
    //   )
    //   .subscribe((val) => {
    //     if (val == AuthStatus.LoggedIn) {
    //       this.store.dispatch(loadMyUpses());
    //     }
    //   });

    this.store.dispatch(refresh());
    this.store.dispatch(loadAllSports());
    this.store.dispatch(loadAllSurfaces());
    this.store.dispatch(loadMyAppointments());
    this.store.dispatch(loadAppointments());
  }

  ngOnDestroy(): void {
    this.death.next();
    this.death.complete();
  }

  async showSignInDialog() {
    this.singInDialogRef = this.dialogService.open(LoginComponent, {
      header: 'Sign in',
      modal: true,
      draggable: false,
      resizable: false,
      dismissableMask: true,
    });

    (await firstValueFrom(this.singInDialogRef.onChildComponentLoaded)).close
      .pipe(take(1))
      .subscribe(() => {
        this.closeSignInDialog();
      });
  }

  closeSignInDialog() {
    if (this.singInDialogRef != null) {
      this.singInDialogRef.close();
    } else {
      console.info('Trying to close non existing dialog');
    }
  }

  goToSingUpPage() {
    this.router.navigate(['/signup']);
  }

  showMyAppointments() {
    selectPayload(this.store)
      .pipe(take(1))
      .subscribe((payload) => {
        if (payload == null) {
          console.error('payload null');
          return;
        }
        this.router.navigateByUrl(`appointments?userId=${payload.user.id}`);
      });
  }
}
