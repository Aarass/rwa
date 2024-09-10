import { CommonModule } from '@angular/common';
import { Component, OnDestroy } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { LetDirective } from '@ngrx/component';
import { Store } from '@ngrx/store';
import { RatingDto, RatingStatsDto, UserInfo } from '@rwa/shared';
import { FileUploadModule } from 'primeng/fileupload';
import { KnobModule } from 'primeng/knob';
import { RatingModule, RatingRateEvent } from 'primeng/rating';
import {
  combineLatest,
  connectable,
  delayWhen,
  filter,
  map,
  Observable,
  ReplaySubject,
  share,
  Subject,
  switchMap,
  take,
  takeUntil,
  tap,
} from 'rxjs';
import { selectPayload } from '../../../auth/store/auth.feature';
import { isNotNull } from '../../../global/functions/rxjs-filter';
import { ConfigService } from '../../../global/services/config/config.service';
import { ImageService } from '../../../image/services/image/image.service';
import { RatingService } from '../../../rating/services/rating/rating.service';
import { UserService } from '../../services/user/user.service';
import { setImage } from '../../store/user.actions';
import { selectUser } from '../../store/user.feature';

@Component({
  selector: 'app-user-info',
  standalone: true,
  imports: [
    LetDirective,
    CommonModule,
    KnobModule,
    FormsModule,
    RatingModule,
    FileUploadModule,
  ],
  templateUrl: './user-info.component.html',
  styleUrl: './user-info.component.scss',
})
export class UserInfoComponent implements OnDestroy {
  death = new Subject<void>();

  userInfo$: ReplaySubject<UserInfo>;
  image$: Observable<string>;

  info: UserInfo | undefined;
  viewerId$: Observable<number | null>;

  myRating: RatingDto | null = null;
  ratingStats: RatingStatsDto | null = null;

  constructor(
    private store: Store,
    private route: ActivatedRoute,
    private userService: UserService,
    private imageService: ImageService,
    private ratingService: RatingService,
    private configService: ConfigService
  ) {
    this.userInfo$ = new ReplaySubject<UserInfo>(1);

    this.viewerId$ = selectPayload(this.store).pipe(
      map((payload) => payload?.user.id ?? null)
    );

    const queriedUserId$ = connectable(
      this.route.queryParamMap.pipe(
        map((map) => {
          const id = map.get('id');
          if (id === null) {
            return null;
          }
          try {
            return parseInt(id);
          } catch {
            return null;
          }
        }),
        filter(isNotNull),
        share(),
        tap((val) => console.log('Izaslo iz queriedUserId', val))
      )
    );

    this.userInfo$.subscribe((info) => {
      this.info = info;
    });

    queriedUserId$
      .pipe(switchMap((userId) => this.ratingService.getStats(userId)))
      .subscribe((stats) => {
        this.ratingStats = stats;
      });

    queriedUserId$
      .pipe(
        delayWhen(() =>
          selectPayload(this.store).pipe(filter(isNotNull), take(1))
        ),
        switchMap((userId) => this.ratingService.getMyRating(userId)),
        map((val) => {
          return (
            val ?? {
              id: -1,
              value: 0,
            }
          );
        }),
        takeUntil(this.death)
      )
      .subscribe((val) => {
        this.myRating = val;
      });

    this.image$ = combineLatest([this.userInfo$, selectUser(this.store)]).pipe(
      map((tuple) => {
        const [info, viewer] = tuple;

        const userId = info.user.id;
        const viewerId = viewer?.id ?? null;

        if (viewer === null || viewerId != userId) {
          return info.user.imageName;
        } else {
          return viewer.imageName;
        }
      }),
      map((imageName) => {
        if (imageName) {
          return `${this.configService.getBackendBaseURL()}/images/${imageName}`;
        }
        return this.configService.getPlaceholderImageURL();
      })
    );

    queriedUserId$
      .pipe(switchMap((id) => this.userService.getUserInfoById(id)))
      .subscribe(this.userInfo$);

    queriedUserId$.connect();
  }

  onFileChange(event: Event) {
    if (event.target === null) throw `Unexpected error`;

    if (this.info === undefined) {
      throw `This should not happen`;
    }

    const file = (event.target as HTMLInputElement).files?.[0];
    if (file != undefined) {
      this.imageService.uploadImage(file).subscribe((data) => {
        if (this.info === undefined) {
          throw 'User info became undefined while waiting for the image to upload';
        }

        this.info.user.imageName = data.name;
        this.store.dispatch(setImage({ name: null }));
        this.store.dispatch(setImage({ name: data.name }));
      });
    }
  }

  deleteImage() {
    if (this.info === undefined) {
      throw `This should not happen`;
    }

    if (this.info.user.imageName) {
      this.imageService.deleteImage(this.info.user.imageName).subscribe();
      this.info.user.imageName = null;
      this.store.dispatch(setImage({ name: null }));
    }
  }

  ratingChanged(e: RatingRateEvent, viewerId: number) {
    if (this.ratingStats === null) throw `This should not happen 1`;
    if (this.myRating === null) throw `This should not happen 2`;
    if (this.info === undefined) throw `This should not happen 3`;

    const { value: newRating } = e;
    const { avg, count: n } = this.ratingStats;

    if (this.myRating.value === 0) {
      this.ratingStats.avg = ((avg ?? 0) * n + newRating) / (n + 1);
      this.ratingStats.count++;
    } else {
      this.ratingStats.avg = (avg ?? 0) + (newRating - this.myRating.value) / n;
    }
    this.myRating.value = newRating;
    this.ratingService
      .postRating({
        userRatedId: this.info.user.id,
        userRatingId: viewerId,
        value: newRating,
      })
      .subscribe((res) => {
        if (this.myRating === null) {
          throw 'My rating became null while waiting for the image to upload';
        }
        this.myRating.id = res.id;
      });
  }

  ratingRemoved() {
    if (this.ratingStats === null) throw `This should not happen 1`;
    if (this.myRating === null) throw `This should not happen 2`;

    if (this.myRating.value === 0) return;

    const { avg, count: n } = this.ratingStats;
    if (n === 1) {
      this.ratingStats.avg = null;
    } else {
      this.ratingStats.avg = ((avg ?? 0) * n - this.myRating.value) / (n - 1);
    }
    this.ratingStats.count--;
    this.myRating.value = 0;

    this.ratingService.deleteRating(this.myRating.id).subscribe();
  }

  getFormatedAvg(ratingStats: RatingStatsDto) {
    return ratingStats.avg?.toFixed(2) ?? 'N/A';
  }

  ngOnDestroy(): void {
    this.death.next();
    this.death.complete();
  }
}
