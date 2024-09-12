import { Observable, tap } from 'rxjs';

export const log = <T>(name: string, source: Observable<T>) =>
  source.pipe(
    tap({
      subscribe: () => console.log(`${name}: subscribed`),
      next: (value) => console.log(`${name}: ${value}`),
      complete: () => console.log(`${name}: completed`),
      finalize: () => console.log(`${name}: unsubscribed`),
    })
  );
