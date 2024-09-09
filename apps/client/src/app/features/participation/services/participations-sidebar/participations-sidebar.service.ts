import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class ParticipationsSidebarService {
  public visible = false;

  open() {
    this.visible = true;
  }

  close() {
    this.visible = false;
  }
}
