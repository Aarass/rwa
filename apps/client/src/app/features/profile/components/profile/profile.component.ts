import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { ButtonModule } from 'primeng/button';
import { SpeedDialModule } from 'primeng/speeddial';
import { UserInfoComponent } from '../../../user/components/user-info/user-info.component';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { selectUser } from '../../../user/store/user.feature';
import { Store } from '@ngrx/store';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [CommonModule, SpeedDialModule, ButtonModule, UserInfoComponent],
  templateUrl: './profile.component.html',
  styleUrl: './profile.component.scss',
})
export class ProfileComponent {
  constructor(
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private store: Store
  ) {
    selectUser(this.store).subscribe((user) => {
      if (!user) throw `Not logged in user should not have access to this page`;

      const queryParams: Params = { id: user.id };
      this.router.navigate([], {
        relativeTo: this.activatedRoute,
        queryParams,
        queryParamsHandling: 'merge',
      });
    });
  }
}
