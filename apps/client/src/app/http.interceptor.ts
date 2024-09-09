import {
  HttpErrorResponse,
  HttpEvent,
  HttpEventType,
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
  filter,
  Observable,
  Subject,
  switchMap,
  take,
  takeUntil,
  tap,
  throwError,
} from 'rxjs';
import { refresh } from './features/auth/store/auth.actions';
import { authFeature } from './features/auth/store/auth.feature';
import { ConfigService } from './features/global/services/config/config.service';

@Injectable()
export class MyHttpInterceptor implements HttpInterceptor {
  constructor(private store: Store, private configService: ConfigService) {}
  intercept(
    request: HttpRequest<any>, // eslint-disable-line @typescript-eslint/no-explicit-any
    handler: HttpHandler
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  ): Observable<HttpEvent<any>> {
    if (!request.url.startsWith(this.configService.getBackendBaseURL())) {
      return handler.handle(request);
    }

    const finished = new Subject<void>();

    return this.store
      .select(authFeature.selectAccessTokenWithDecodedPayload)
      .pipe(
        // tap((val) => {
        //   console.log(request.url, val);
        // }),
        takeUntil(finished),
        take(2),
        switchMap((data) => {
          const { accessToken, payload } = data;
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
              catchError((err: HttpErrorResponse) => {
                if (err.status == 401) {
                  if (payload != null && checkIfJwtExpired(payload.exp)) {
                    this.store.dispatch(refresh());
                    return EMPTY;
                  }
                }
                return throwError(() => err);
              }),
              filter((val) => val.type == HttpEventType.Response),
              tap(() => finished.next())
            );
        })
      );
  }
}

function checkIfJwtExpired(exp: number) {
  return Date.now() >= exp * 1000;
}

// intercept(
//   request: HttpRequest<any>,
//   handler: HttpHandler
// ): Observable<HttpEvent<any>> {
//   if (!request.url.startsWith(this.configService.getBackendBaseURL())) {
//     return handler.handle(request);
//   }

//   return this.store.select(selectAccessToken).pipe(
//     take(2),
//     exhaustMap((accessToken) => {
//       return handler
//         .handle(
//           request.clone({
//             withCredentials: true,
//             headers:
//               accessToken == null
//                 ? undefined
//                 : new HttpHeaders().set(
//                     'Authorization',
//                     `Bearer ${accessToken}`
//                   ),
//           })
//         )
//         .pipe(
//           catchError((err: HttpErrorResponse) => {
//             if (accessToken != null && err.status == 401) {
//               this.store.dispatch(refresh());
//               return EMPTY;
//             } else {
//               return throwError(() => err);
//             }
//           })
//         );
//     })
//   );
// }

//   intercept(
//     request: HttpRequest<any>,
//     handler: HttpHandler
//   ): Observable<HttpEvent<any>> {
//     if (!request.url.startsWith(this.configService.getBackendBaseURL())) {
//       return handler.handle(request);
//     }

//     return this.store.select(selectAccessToken).pipe(
//       take(1),
//       exhaustMap((accessToken) => {
//         return handler
//           .handle(
//             request.clone({
//               withCredentials: true,
//               headers:
//                 accessToken == null
//                   ? undefined
//                   : new HttpHeaders().set(
//                       'Authorization',
//                       `Bearer ${accessToken}`
//                     ),
//             })
//           )
//           .pipe(
//             catchError((err: HttpErrorResponse) => {
//               if (accessToken != null && err.status == 401) {
//                 console.log('Retryujem');
//                 this.store.dispatch(refresh());
//                 return this.store.select(selectAccessToken).pipe(
//                   skip(1),
//                   take(1),
//                   exhaustMap((accessToken) => {
//                     return handler.handle(
//                       request.clone({
//                         withCredentials: true,
//                         headers:
//                           accessToken == null
//                             ? undefined
//                             : new HttpHeaders().set(
//                                 'Authorization',
//                                 `Bearer ${accessToken}`
//                               ),
//                       })
//                     );
//                   })
//                 );
//               } else {
//                 return throwError(() => err);
//                 // console.log('Vracam empty');
//                 // return EMPTY;
//               }
//             })
//           );
//       })
//     );
//   }
