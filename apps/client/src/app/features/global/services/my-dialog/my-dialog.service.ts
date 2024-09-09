import { EventEmitter, Injectable, Type } from '@angular/core';
import { DialogService, DynamicDialogRef } from 'primeng/dynamicdialog';
import { take } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class MyDialogService {
  ref: DynamicDialogRef | null;

  constructor(private primengDialogService: DialogService) {
    this.ref = null;
  }

  open<T>(componentType: Type<T>, config?: { header: string }) {
    if (this.ref != null) {
      console.error(`You haven't closed last dialog`);
      return;
    }

    this.ref = this.primengDialogService.open(componentType, {
      header: 'Add sport you play',
      modal: true,
      draggable: false,
      resizable: false,
      dismissableMask: true,
      styleClass: 'w-20rem',
      ...config,
    });

    this.ref.onChildComponentLoaded.pipe(take(1)).subscribe((component) => {
      if (component.close instanceof EventEmitter) {
        component.close.pipe(take(1)).subscribe(() => {
          this.close();
        });
      }
    });

    this.ref.onClose.pipe(take(1)).subscribe(() => {
      this.ref = null;
    });
  }

  close() {
    if (this.ref === null) {
      console.error(`There is no dialog to close`);
      return;
    }

    this.ref.close();
  }
}
