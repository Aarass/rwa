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
import { combineLatest, fromEvent, Subscription } from 'rxjs';
import { AppointmentListComponent } from '../../../appointment/components/appointment-list/appointment-list.component';
import { selectUser } from '../../../user/store/user.feature';

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

  subscription: Subscription | undefined;

  constructor(private store: Store, private router: Router) {}

  ngAfterViewInit() {
    this.subscription = combineLatest([
      selectUser(this.store),
      fromEvent(this.button.nativeElement, 'click'),
    ]).subscribe((tuple) => {
      const [user] = tuple;

      if (user) {
        this.router.navigateByUrl('appointments');
      } else {
        this.router.navigateByUrl('signup');
      }
    });
  }

  ngOnDestroy() {
    if (this.subscription) {
      this.subscription.unsubscribe();
    }
  }
}
