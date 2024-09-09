import { CommonModule } from '@angular/common';
import { Component, OnDestroy } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Store } from '@ngrx/store';
import { RatingDto, RatingStatsDto, UserInfo } from '@rwa/shared';
import { FileUploadModule } from 'primeng/fileupload';
import { KnobModule } from 'primeng/knob';
import { RatingModule } from 'primeng/rating';
import {
  combineLatest,
  filter,
  map,
  Observable,
  shareReplay,
  Subject,
  switchMap,
  takeUntil,
} from 'rxjs';
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

  info: UserInfo | undefined;
  viewerId: number | null = null;

  myRating: RatingDto | null = null;
  ratingStats: RatingStatsDto | null = null;

  image$: Observable<string>;

  constructor(
    private store: Store,
    private route: ActivatedRoute,
    private userService: UserService,
    private imageService: ImageService,
    private ratingService: RatingService,
    private configService: ConfigService
  ) {
    const viewerId$ = selectUser(this.store).pipe(
      takeUntil(this.death),
      map((val) => {
        return val?.id ?? null;
      })
    );

    viewerId$.subscribe((id) => {
      this.viewerId = id;
    });

    const userInfo$ = this.route.queryParamMap.pipe(
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
      takeUntil(this.death),
      filter(isNotNull),
      switchMap((id) => {
        return this.userService.getUserInfoById(id);
      }),
      shareReplay(1)
    );

    userInfo$.subscribe((info) => {
      this.info = info;
    });

    userInfo$
      .pipe(
        switchMap((info) => {
          return this.ratingService.getStats(info.user.id);
        })
      )
      .subscribe((val) => {
        this.ratingStats = val;
      });

    viewerId$
      .pipe(
        filter((viewerId) => {
          return viewerId != null;
        }),
        switchMap(() => userInfo$)
      )
      .pipe(
        switchMap((info) => {
          return this.ratingService.getMyRating(info.user.id);
        }),
        map((val) => {
          return (
            val ?? {
              id: -1,
              value: 0,
            }
          );
        })
      )
      .subscribe((val) => {
        this.myRating = val;
      });

    this.image$ = combineLatest([
      userInfo$,
      // this.store.select(userFeature.selectMe),
      selectUser(this.store),
    ]).pipe(
      map((tuple) => {
        const [info, viewer] = tuple;

        const userId = info.user.id;
        const viewerId = viewer?.id ?? null;

        if (viewer == null || viewerId != userId) {
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

  onFileChange(event: Event) {
    if (event.target === null) throw `Unexpected error`;

    if (this.info == undefined) {
      throw `This should not happen`;
    }

    const file = (event.target as HTMLInputElement).files?.[0];
    if (file != undefined) {
      this.imageService.uploadImage(file).subscribe((data) => {
        if (this.info == undefined) {
          throw 'User info became undefined while waiting for the image to upload';
        }

        this.info.user.imageName = data.name;
        this.store.dispatch(setImage({ name: null }));
        this.store.dispatch(setImage({ name: data.name }));
      });
    }
  }

  deleteImage() {
    if (this.info == undefined) {
      throw `This should not happen`;
    }

    if (this.info.user.imageName) {
      this.imageService.deleteImage(this.info.user.imageName).subscribe();
      this.info.user.imageName = null;
      this.store.dispatch(setImage({ name: null }));
    }
  }

  ratingChanged(e: { value: number }) {
    if (this.ratingStats == null) throw `This should not happen 1`;
    if (this.myRating == null) throw `This should not happen 2`;
    if (this.info == null) throw `This should not happen 3`;
    if (this.viewerId == null) throw `This should not happen 4`;

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
        userRatingId: this.viewerId,
        value: newRating,
      })
      .subscribe((res) => {
        if (this.myRating == undefined) {
          throw 'My rating became undefined while waiting for the image to upload';
        }
        this.myRating.id = res.id;
      });
  }

  ratingRemoved() {
    if (this.ratingStats == null) throw `This should not happen 1`;
    if (this.myRating == null) throw `This should not happen 2`;

    if (this.myRating.value == 0) return;

    const { avg, count: n } = this.ratingStats;
    if (n == 1) {
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
