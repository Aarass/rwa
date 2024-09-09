import { Injectable } from '@angular/core';
import { Store } from '@ngrx/store';
import { participationFeature } from '../../store/participation.feature';
import { combineLatest, delay, map, Observable, Subject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class ParticipationsSidebarService {
  private visible$ = new Subject<boolean>();

  public visible = false;
  public isMinimized$: Observable<boolean>;

  constructor(private store: Store) {
    this.isMinimized$ = combineLatest([
      this.visible$,
      this.store.select(participationFeature.selectSelectedAppointmentId),
    ]).pipe(
      map((tuple) => {
        const [visible, selectedId] = tuple;
        if (visible === false && selectedId !== null) {
          return true;
        }
        return false;
      })
    );
  }

  open() {
    this.visible = true;
    // Iz nekog razloga postavljanje na true se vidi u change dok na false ne
    // this.visible$.next(true);
  }

  close() {
    this.visible = false;
    this.visible$.next(false);
  }

  change(val: boolean) {
    this.visible$.next(val);
  }
}
