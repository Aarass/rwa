import {
  HttpErrorResponse,
  HttpEvent,
  HttpHandler,
  HttpHeaders,
  HttpInterceptor,
  HttpRequest,
} from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Store } from '@ngrx/store';
import {
  catchError,
  EMPTY,
  exhaustMap,
  Observable,
  retry,
  take,
  takeWhile,
  tap,
} from 'rxjs';
import { refresh } from './features/auth/store/actions';
import { selectAccessToken } from './features/auth/store/selectors';
import { ConfigService } from './features/global/services/config/config.service';
@Injectable()
export class MyHttpInterceptor implements HttpInterceptor {
  constructor(private store: Store, private configService: ConfigService) {}
  intercept(
    request: HttpRequest<any>,
    handler: HttpHandler
  ): Observable<HttpEvent<any>> {
    if (!request.url.startsWith(this.configService.getBackendBaseURL())) {
      return handler.handle(request);
    }

    let shouldRetry = true;

    return this.store.select(selectAccessToken).pipe(
      take(2),
      takeWhile(() => shouldRetry),
      exhaustMap((accessToken) => {
        return handler
          .handle(
            request.clone({
              withCredentials: true,
              headers:
                accessToken == null
                  ? undefined
                  : new HttpHeaders().set(
                      'Authorization',
                      `Bearer ${accessToken}`
                    ),
            })
          )
          .pipe(
            // Za slucaj da se request izvrsi bez greske
            tap(() => {
              shouldRetry = false;
            }),
            catchError((err: HttpErrorResponse) => {
              if (accessToken != null && err.status == 401) {
                this.store.dispatch(refresh());
                shouldRetry = true;
              } else {
                shouldRetry = false;
              }

              return EMPTY;
            })
          );
      })
    );
  }
}
