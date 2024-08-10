import { Component, OnDestroy, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AvatarModule } from 'primeng/avatar';
import { Store } from '@ngrx/store';
import { Router } from '@angular/router';
import { filter, Subject, takeUntil } from 'rxjs';
import { MenuItem } from 'primeng/api';
import { SpeedDialModule } from 'primeng/speeddial';
import { logout } from '../../../auth/store/auth.actions';
import { authFeature } from '../../../auth/store/auth.feature';

@Component({
  selector: 'app-profile-summary',
  standalone: true,
  imports: [CommonModule, AvatarModule, SpeedDialModule],
  templateUrl: './profile-summary.component.html',
  styleUrl: './profile-summary.component.scss',
})
export class ProfileSummaryComponent implements OnInit, OnDestroy {
  death = new Subject<void>();

  userName: string = '';
  userSurname: string = '';
  items: MenuItem[] = [
    {
      icon: 'pi pi-user',
      routerLink: ['/profile'],
    },
    {
      icon: 'pi pi-sign-out',
      command: () => {
        this.logout();
      },
    },
  ];

  constructor(private store: Store, private router: Router) {}

  ngOnInit(): void {
    this.store
      .select(authFeature.selectDecodedPayload)
      .pipe(
        filter((val) => val != null),
        takeUntil(this.death)
      )
      .subscribe((payload) => {
        this.userName = payload!.user.name;
        this.userSurname = payload!.user.surname;
      });
  }

  ngOnDestroy(): void {
    this.death.next();
    this.death.complete();
  }

  logout() {
    this.store.dispatch(logout());
  }
}
