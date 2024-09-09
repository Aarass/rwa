import {
  HTTP_INTERCEPTORS,
  provideHttpClient,
  withInterceptorsFromDi,
} from '@angular/common/http';
import {
  ApplicationConfig,
  isDevMode,
  provideZoneChangeDetection,
} from '@angular/core';
import { provideAnimations } from '@angular/platform-browser/animations';
import { provideRouter } from '@angular/router';
import { provideEffects } from '@ngrx/effects';
import { provideState, provideStore } from '@ngrx/store';
import { provideStoreDevtools } from '@ngrx/store-devtools';
import { ConfirmationService, MessageService } from 'primeng/api';
import { DialogService } from 'primeng/dynamicdialog';
import { appRoutes } from './app.routes';
import { AppointmentEffects } from './features/appointment/store/appointment.effects';
import { appointmentFeature } from './features/appointment/store/appointment.feature';
import { AuthEffects } from './features/auth/store/auth.effects';
import { authFeature } from './features/auth/store/auth.feature';
import { FilterEffects } from './features/filters/store/filter.effects';
import { filtersFeature } from './features/filters/store/filters.feature';
import { GlobalEffects } from './features/global/effects/global.effects';
import { ConfigService } from './features/global/services/config/config.service';
import { MyDialogService } from './features/global/services/my-dialog/my-dialog.service';
import { ImageService } from './features/image/services/image/image.service';
import { LocationService } from './features/location/services/location/location.service';
import { ParticipationEffects } from './features/participation/store/participation.effects';
import { participationFeature } from './features/participation/store/participation.feature';
import { SportService } from './features/sport/services/sport/sport.service';
import { SportEffects } from './features/sport/store/sport.effects';
import { sportFeature } from './features/sport/store/sport.feature';
import { SurfaceEffects } from './features/surface/store/surface.effects';
import { surfaceFeature } from './features/surface/store/surface.feature';
import { UpsService } from './features/ups/services/ups/ups.service';
import { UpsEffects } from './features/ups/store/ups.effects';
import { upsFeature } from './features/ups/store/ups.feature';
import { UserEffects } from './features/user/store/user.effects';
import { userFeature } from './features/user/store/user.feature';
import { MyHttpInterceptor } from './http.interceptor';
import { withInMemoryScrolling } from '@angular/router';

export const appConfig: ApplicationConfig = {
  providers: [
    provideRouter(appRoutes),
    provideHttpClient(withInterceptorsFromDi()),
    { provide: HTTP_INTERCEPTORS, useClass: MyHttpInterceptor, multi: true },
    {
      provide: ImageService,
    },
    {
      provide: UpsService,
    },
    {
      provide: LocationService,
    },
    {
      provide: SportService,
    },
    {
      provide: ConfirmationService,
    },
    {
      provide: MessageService,
    },
    {
      provide: MyDialogService,
    },
    {
      provide: DialogService,
    },
    {
      provide: ConfigService,
    },
    provideStore(),
    provideState(authFeature),
    provideState(sportFeature),
    provideState(surfaceFeature),
    provideState(upsFeature),
    provideState(appointmentFeature),
    provideState(filtersFeature),
    provideState(participationFeature),
    provideState(userFeature),
    provideEffects([
      GlobalEffects,
      AuthEffects,
      SportEffects,
      SurfaceEffects,
      UpsEffects,
      AppointmentEffects,
      FilterEffects,
      ParticipationEffects,
      UserEffects,
    ]),
    provideStoreDevtools({
      maxAge: 25,
      logOnly: !isDevMode(),
      autoPause: true,
      trace: true,
      traceLimit: 75,
      connectInZone: true,
    }),
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideAnimations(),
  ],
};
