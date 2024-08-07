import { Component, OnDestroy, OnInit } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { MessageService, PrimeNGConfig } from 'primeng/api';
import { MenubarModule } from 'primeng/menubar';
import { BadgeModule } from 'primeng/badge';
import { ToastModule } from 'primeng/toast';
import { InputTextModule } from 'primeng/inputtext';
import { CommonModule } from '@angular/common';
import { RippleModule } from 'primeng/ripple';
import { ButtonModule } from 'primeng/button';
import { DynamicDialogModule } from 'primeng/dynamicdialog';
import { LoginComponent } from './features/auth/components/login/login.component';
import { Store } from '@ngrx/store';
import { selectAuthStatus } from './features/auth/store/selectors';
import { Subject, takeUntil } from 'rxjs';
import { AuthStatus } from './features/auth/store/state';
import { DialogService, DynamicDialogRef } from 'primeng/dynamicdialog';
import { ProfileSummaryComponent } from './features/profile/components/profile-summary/profile-summary.component';

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

  authStatus: AuthStatus = AuthStatus.NotLoggedIn;
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
      .select(selectAuthStatus)
      .pipe(takeUntil(this.death))
      .subscribe((val) => {
        this.authStatus = val;
        this.closeSignInDialog();
      });
  }

  ngOnDestroy(): void {
    this.death.next();
    this.death.complete();
  }

  showSignInDialog() {
    this.singInDialogRef = this.dialogService.open(LoginComponent, {
      header: 'Sign in',
      modal: true,
      draggable: false,
      resizable: false,
      dismissableMask: true,
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
