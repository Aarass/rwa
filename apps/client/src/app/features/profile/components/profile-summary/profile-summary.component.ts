import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { Store } from '@ngrx/store';
import { UserDto } from '@rwa/shared';
import { MenuItem } from 'primeng/api';
import { AvatarModule } from 'primeng/avatar';
import { OverlayPanelModule } from 'primeng/overlaypanel';
import { SpeedDialModule } from 'primeng/speeddial';
import { Observable } from 'rxjs';
import { logout } from '../../../auth/store/auth.actions';
import { ConfigService } from '../../../global/services/config/config.service';
import { selectUser } from '../../../user/store/user.feature';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-profile-summary',
  standalone: true,
  imports: [
    CommonModule,
    AvatarModule,
    SpeedDialModule,
    OverlayPanelModule,
    RouterModule,
  ],
  templateUrl: './profile-summary.component.html',
  styleUrl: './profile-summary.component.scss',
})
export class ProfileSummaryComponent {
  user$: Observable<UserDto | null>;
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

  constructor(private store: Store, private configService: ConfigService) {
    this.user$ = selectUser(this.store);
  }

  getImageURL(imageName: string | null) {
    if (imageName === null) {
      return `https://st3.depositphotos.com/6672868/13701/v/450/depositphotos_137014128-stock-illustration-user-profile-icon.jpg`;
      // return `https://wallpapers.com/images/featured/cool-profile-picture-87h46gcobjl5e4xu.jpg`;
    } else {
      return this.configService.getImageURL(imageName);
    }
  }

  logout() {
    this.store.dispatch(logout());
  }
}
