import { CommonModule } from '@angular/common';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { Store } from '@ngrx/store';
import { PrimeNGConfig } from 'primeng/api';
import { BadgeModule } from 'primeng/badge';
import { ButtonModule } from 'primeng/button';
import {
  DialogService,
  DynamicDialogModule,
  DynamicDialogRef,
} from 'primeng/dynamicdialog';
import { InputTextModule } from 'primeng/inputtext';
import { MenubarModule } from 'primeng/menubar';
import { RippleModule } from 'primeng/ripple';
import { ToastModule } from 'primeng/toast';
import { firstValueFrom, Subject, take, takeUntil } from 'rxjs';
import { LoginComponent } from './features/auth/components/login/login.component';
import { refresh } from './features/auth/store/auth.actions';
import { AuthStatus } from './features/auth/store/auth.state';
import { ProfileSummaryComponent } from './features/profile/components/profile-summary/profile-summary.component';
import { authFeature } from './features/auth/store/auth.feature';

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
  ],
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
})
export class AppComponent implements OnInit, OnDestroy {
  death = new Subject<void>();

  authStatus: AuthStatus | null = null;
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
        }
      });

    this.store.dispatch(refresh());
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
}
