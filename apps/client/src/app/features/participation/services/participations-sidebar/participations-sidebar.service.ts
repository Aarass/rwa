import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class ParticipationsSidebarService {
  public visible = false;
  public visible$ = new BehaviorSubject<boolean>(false);

  open() {
    this.visible = true;
    this.visible$.next(true);
  }

  close() {
    this.visible = false;
    this.visible$.next(false);
  }
}
