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

  viewerId$: Observable<number | null>;

  image$: Observable<string>;
  userInfo$ = new ReplaySubject<UserInfo>(1);
  myRating$ = new ReplaySubject<RatingDto>(1);
  ratingStats$ = new ReplaySubject<RatingStatsDto>(1);

  constructor(
    private store: Store,
    private route: ActivatedRoute,
    private userService: UserService,
    private imageService: ImageService,
    private ratingService: RatingService,
    private configService: ConfigService
  ) {
    this.viewerId$ = selectPayload(this.store).pipe(
      map((payload) => payload?.user.id ?? null)
    );

    const queriedUserId$ = connectable(
      // log(
      //   'Queried user',
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
        share()
      )
      // )
    );

    queriedUserId$
      .pipe(switchMap((userId) => this.ratingService.getStats(userId)))
      .subscribe(this.ratingStats$);

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
      .subscribe(this.myRating$);

    queriedUserId$
      .pipe(switchMap((id) => this.userService.getUserInfoById(id)))
      .subscribe(this.userInfo$);

    queriedUserId$.connect();

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
  }

  onFileChange(event: Event, info: UserInfo) {
    if (event.target === null) throw `Unexpected error`;

    const file = (event.target as HTMLInputElement).files?.[0];
    if (file != undefined) {
      this.imageService.uploadImage(file).subscribe((data) => {
        // this.info.user.imageName = data.name;
        info.user.imageName = data.name;
        this.userInfo$.next(info);

        this.store.dispatch(setImage({ name: null }));
        this.store.dispatch(setImage({ name: data.name }));
      });
    }
  }

  deleteImage(info: UserInfo) {
    if (info.user.imageName) {
      this.imageService.deleteImage(info.user.imageName).subscribe();
      this.store.dispatch(setImage({ name: null }));

      info.user.imageName = null;
      this.userInfo$.next(info);
    }
  }

  ratingChanged(
    e: RatingRateEvent,
    info: UserInfo,
    myRating: RatingDto,
    ratingStats: RatingStatsDto,
    viewerId: number
  ) {
    const newRating = e.value;
    const avg = ratingStats.avg;
    const n = ratingStats.count;

    if (myRating.value === 0) {
      ratingStats.avg = ((avg ?? 0) * n + newRating) / (n + 1);
      ratingStats.count++;
    } else {
      ratingStats.avg = (avg ?? 0) + (newRating - myRating.value) / n;
    }
    myRating.value = newRating;

    this.ratingStats$.next(ratingStats);
    this.myRating$.next(myRating);

    this.ratingService
      .postRating({
        userRatedId: info.user.id,
        userRatingId: viewerId,
        value: newRating,
      })
      .subscribe((res) => {
        myRating.id = res.id;
        this.myRating$.next(myRating);
      });
  }

  ratingRemoved(myRating: RatingDto, ratingStats: RatingStatsDto) {
    if (ratingStats === null) throw `This should not happen 1`;

    if (myRating.value === 0) return;

    const avg = ratingStats.avg;
    const n = ratingStats.count;

    if (n === 1) {
      ratingStats.avg = null;
    } else {
      ratingStats.avg = ((avg ?? 0) * n - myRating.value) / (n - 1);
    }
    ratingStats.count--;
    myRating.value = 0;

    this.ratingStats$.next(ratingStats);
    this.myRating$.next(myRating);

    this.ratingService.deleteRating(myRating.id).subscribe();
  }

  getFormatedAvg(ratingStats: RatingStatsDto) {
    return ratingStats.avg?.toFixed(2) ?? 'N/A';
  }

  ngOnDestroy(): void {
    this.death.next();
    this.death.complete();
  }
}
