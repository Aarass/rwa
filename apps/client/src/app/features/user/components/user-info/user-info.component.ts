import { CommonModule } from '@angular/common';
import { Component, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Store } from '@ngrx/store';
import { UserInfo } from '@rwa/shared';
import { RatingModule } from 'primeng/rating';
import { KnobModule } from 'primeng/knob';
import { filter, map, Observable, Subject, switchMap, takeUntil } from 'rxjs';
import { UserService } from '../../services/user/user.service';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-user-info',
  standalone: true,
  imports: [CommonModule, KnobModule, FormsModule, RatingModule],
  templateUrl: './user-info.component.html',
  styleUrl: './user-info.component.scss',
})
export class UserInfoComponent implements OnDestroy {
  death = new Subject<void>();
  info: UserInfo | undefined;
  constructor(
    private store: Store,
    private route: ActivatedRoute,
    private userService: UserService
  ) {
    this.route.queryParamMap
      .pipe(
        map((map) => {
          const id = map.get('id');
          if (id == null) {
            return null;
          }
          try {
            return parseInt(id);
          } catch {
            return null;
          }
        }),
        filter((val) => val != null),
        switchMap((id) => {
          return this.userService.getUserInfoById(id!);
        }),
        takeUntil(this.death)
      )
      .subscribe((info: any) => {
        this.info = info;
      });
  }

  ngOnDestroy(): void {
    this.death.next();
    this.death.complete();
  }
}
