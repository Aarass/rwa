import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { RouterModule } from '@angular/router';
import { LetDirective } from '@ngrx/component';
import { Store } from '@ngrx/store';
import { PrimeNGConfig } from 'primeng/api';
import { BadgeModule } from 'primeng/badge';
import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { DividerModule } from 'primeng/divider';
import { DynamicDialogModule } from 'primeng/dynamicdialog';
import { MenubarModule } from 'primeng/menubar';
import { RippleModule } from 'primeng/ripple';
import { SidebarModule } from 'primeng/sidebar';
import { ToastModule } from 'primeng/toast';
import { Observable } from 'rxjs';
import { ParticipantsComponent } from './features/appointment/components/participants/participants.component';
import { LoginComponent } from './features/auth/components/login/login.component';
import { restoreSession } from './features/auth/store/auth.actions';
import { authFeature } from './features/auth/store/auth.feature';
import { AuthStatus } from './features/auth/store/auth.state';
import { openSignIn } from './features/global/actions/global.actions';
import { ParticipationsSidebarService } from './features/participation/services/participations-sidebar/participations-sidebar.service';
import { clearParticipants } from './features/participation/store/participation.actions';
import { participationFeature } from './features/participation/store/participation.feature';
import { ProfileSummaryComponent } from './features/profile/components/profile-summary/profile-summary.component';
import { loadAllSports } from './features/sport/store/sport.actions';
import { loadAllSurfaces } from './features/surface/store/surface.actions';

@Component({
  standalone: true,
  imports: [
    SidebarModule,
    ProfileSummaryComponent,
    LetDirective,
    RouterModule,
    MenubarModule,
    BadgeModule,
    RippleModule,
    CommonModule,
    ButtonModule,
    DynamicDialogModule,
    LoginComponent,
    ToastModule,
    CardModule,
    ParticipantsComponent,
    ConfirmDialogModule,
    DividerModule,
  ],
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
})
export class AppComponent implements OnInit {
  isAdmin$: Observable<boolean>;
  authStatus$: Observable<AuthStatus | null>;
  unseenChanges$: Observable<number>;

  constructor(
    private store: Store,
    private primengConfig: PrimeNGConfig,
    public participationSidebarService: ParticipationsSidebarService
  ) {
    this.isAdmin$ = this.store.select(authFeature.selectIsAdmin);
    this.authStatus$ = this.store.select(authFeature.selectStatus);
    this.unseenChanges$ = this.store.select(
      participationFeature.selectChangesCount
    );
  }

  ngOnInit() {
    this.primengConfig.ripple = true;

    this.store.dispatch(restoreSession());
    this.store.dispatch(loadAllSports());
    this.store.dispatch(loadAllSurfaces());
  }

  navigationVisible = false;
  toggleNavigation() {
    this.navigationVisible = !this.navigationVisible;
  }

  showSignInDialog() {
    this.store.dispatch(openSignIn());
  }

  clearParticipants() {
    this.store.dispatch(clearParticipants());
  }

  alert() {
    alert();
  }
}
