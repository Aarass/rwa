import { CommonModule } from '@angular/common';
import { Component, OnDestroy } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Store } from '@ngrx/store';
import { UserInfo } from '@rwa/shared';
import { FileUploadModule } from 'primeng/fileupload';
import { KnobModule } from 'primeng/knob';
import { RatingModule } from 'primeng/rating';
import {
  combineLatest,
  filter,
  iif,
  map,
  Observable,
  of,
  Subject,
  switchMap,
  takeUntil,
  tap,
} from 'rxjs';
import { selectPayload } from '../../../auth/store/auth.feature';
import { ConfigService } from '../../../global/services/config/config.service';
import { ImageService } from '../../../image/services/image/image.service';
import { UserService } from '../../services/user/user.service';
import { setImage } from '../../store/user.actions';
import { userFeature } from '../../store/user.feature';

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

  image$: Observable<string>;

  constructor(
    private store: Store,
    private route: ActivatedRoute,
    private userService: UserService,
    private imageService: ImageService,
    private configService: ConfigService
  ) {
    selectPayload(this.store).subscribe((val) => {
      this.viewerId = val?.user.id ?? null;
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
      filter((val) => val != null),
      switchMap((id) => {
        return this.userService.getUserInfoById(id!);
      }),
      takeUntil(this.death)
    );

    userInfo$.subscribe((info) => {
      this.info = info;
    });

    this.image$ = combineLatest([
      userInfo$,
      this.store.select(userFeature.selectMe),
    ]).pipe(
      switchMap((tuple) => {
        const userId = tuple[0].user.id;
        const viewerId = tuple[1]?.id ?? null;
        console.log(userId, viewerId);
        return iif(
          () => {
            const tmp = viewerId == null || viewerId != userId;
            console.log(tmp);
            return tmp;
          },
          of(tuple[0].user.imageName),
          of(tuple[1]?.imageName!)
        );
      }),
      tap((name) => console.log(name)),
      map((imageName) => {
        if (imageName) {
          return `${this.configService.getBackendBaseURL()}/images/${imageName}`;
        }
        return `https://st3.depositphotos.com/6672868/13701/v/450/depositphotos_137014128-stock-illustration-user-profile-icon.jpg`;
      })
    );
  }

  onChange(event: any) {
    if (this.info == undefined) {
      throw `This should not happen`;
    }

    const file = event.target.files[0];
    if (file != undefined) {
      this.imageService.uploadImage(file).subscribe((data) => {
        this.info!.user.imageName = data.name;
        this.store.dispatch(setImage({ name: null }));
        this.store.dispatch(setImage({ name: data.name }));
      });
    }
  }

  deleteImage() {
    if (this.info == undefined) {
      throw `This should not happen`;
    }

    const imageName = this.info.user.imageName;
    if (imageName) {
      this.imageService.deleteImage(imageName).subscribe();
      this.info.user.imageName = null;
      this.store.dispatch(setImage({ name: null }));
    }
  }

  ngOnDestroy(): void {
    this.death.next();
    this.death.complete();
  }
}
