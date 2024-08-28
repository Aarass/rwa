import { CommonModule } from '@angular/common';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { UpsDto } from '@rwa/shared';
import { ButtonModule } from 'primeng/button';
import { CarouselModule, CarouselResponsiveOptions } from 'primeng/carousel';
import { Subject, takeUntil } from 'rxjs';
import { MyDialogService } from '../../../global/services/my-dialog/my-dialog.service';
import { upsFeature } from '../../store/ups.feature';
import { CreateUpsComponent } from '../create-ups/create-ups.component';
import { UpsListItemComponent } from '../ups-list-item/ups-list-item.component';

@Component({
  selector: 'app-ups-list',
  standalone: true,
  imports: [CommonModule, UpsListItemComponent, ButtonModule, CarouselModule],
  templateUrl: './ups-list.component.html',
  styleUrl: './ups-list.component.scss',
})
export class UpsListComponent implements OnInit, OnDestroy {
  death = new Subject<void>();

  upses: UpsDto[] = [];
  sportsLeft = true;

  responsiveOptions: CarouselResponsiveOptions[] = [
    {
      breakpoint: '1400px',
      numVisible: 3,
      numScroll: 3,
    },
    {
      breakpoint: '1220px',
      numVisible: 2,
      numScroll: 2,
    },
    {
      breakpoint: '1100px',
      numVisible: 1,
      numScroll: 1,
    },
  ];

  constructor(private store: Store, private dialogService: MyDialogService) {}

  ngOnInit(): void {
    this.store
      .select(upsFeature.selectMyUpses)
      .pipe(takeUntil(this.death))
      .subscribe((val) => (this.upses = val));

    this.store
      .select(upsFeature.selectSportsIDontPlay)
      .pipe(takeUntil(this.death))
      .subscribe((val) => (this.sportsLeft = val.length > 0));
  }

  ngOnDestroy(): void {
    this.death.next();
    this.death.complete();
  }

  openUpsDialog() {
    this.dialogService.open(CreateUpsComponent, {
      header: 'Add a sport',
    });
  }
}
