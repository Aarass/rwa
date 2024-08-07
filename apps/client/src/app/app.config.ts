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
import { provideStore } from '@ngrx/store';
import { provideStoreDevtools } from '@ngrx/store-devtools';
import { MessageService } from 'primeng/api';
import { DialogService } from 'primeng/dynamicdialog';
import { appRoutes } from './app.routes';
import { AuthEffects } from './features/auth/store/effects';
import { authReducer } from './features/auth/store/reducer';
import { MyHttpInterceptor } from './http.interceptor';
import { ConfigService } from './features/global/services/config/config.service';

export const appConfig: ApplicationConfig = {
  providers: [
    {
      provide: MessageService,
    },
    {
      provide: DialogService,
    },
    {
      provide: ConfigService,
    },
    provideStore({
      auth: authReducer,
    }),
    provideEffects([AuthEffects]),
    provideStoreDevtools({
      maxAge: 25,
      logOnly: !isDevMode(),
      autoPause: true,
      trace: false,
      traceLimit: 75,
      connectInZone: true,
    }),
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideRouter(appRoutes),
    provideHttpClient(withInterceptorsFromDi()),
    { provide: HTTP_INTERCEPTORS, useClass: MyHttpInterceptor, multi: true },
    provideAnimations(),
  ],
};
