import { CommonModule } from '@angular/common';
import {
  AfterViewInit,
  Component,
  ElementRef,
  OnDestroy,
  ViewChild,
} from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { Store } from '@ngrx/store';
import { ButtonModule } from 'primeng/button';
import { DividerModule } from 'primeng/divider';
import { fromEvent, Subject, takeUntil } from 'rxjs';
import { AppointmentListComponent } from '../../../appointment/components/appointment-list/appointment-list.component';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [
    CommonModule,
    ButtonModule,
    RouterModule,
    AppointmentListComponent,
    DividerModule,
  ],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss',
})
export class HomeComponent implements AfterViewInit, OnDestroy {
  @ViewChild('button')
  button!: ElementRef;

  death = new Subject<void>();

  constructor(private store: Store, private router: Router) {}

  ngAfterViewInit() {
    fromEvent(this.button.nativeElement, 'click')
      .pipe(takeUntil(this.death))
      .subscribe(() => {
        this.router.navigateByUrl('appointments');
      });
  }

  ngOnDestroy() {
    this.death.next();
    this.death.complete();
  }
}
