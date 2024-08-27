import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Output } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { Store } from '@ngrx/store';
import { AppointmentsOrdering, SportDto } from '@rwa/shared';
import { CalendarModule } from 'primeng/calendar';
import { CheckboxModule } from 'primeng/checkbox';
import { DropdownModule } from 'primeng/dropdown';
import { FloatLabelModule } from 'primeng/floatlabel';
import { InputNumberModule } from 'primeng/inputnumber';
import { SliderModule } from 'primeng/slider';
import { Observable, Subject, filter, map } from 'rxjs';
import {
  dateStringFromDate,
  timeStringFromDate,
} from '../../../global/functions/date-utility';
import { upsFeature } from '../../../ups/store/ups.feature';
import { UserConfigurableFilters } from '../../interfaces/filters';
import { filtersChanged } from '../../store/filter.actions';
import { InputGroupModule } from 'primeng/inputgroup';
import { sportFeature } from '../../../sport/store/sport.feature';

@Component({
  selector: 'app-filters',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    FloatLabelModule,
    DropdownModule,
    CalendarModule,
    InputNumberModule,
    SliderModule,
    InputGroupModule,
    CheckboxModule,
  ],
  templateUrl: './filters.component.html',
  styleUrl: './filters.component.scss',
})
export class FiltersComponent {
  death = new Subject<void>();

  @Output()
  onClose = new EventEmitter<void>();

  sorting: {
    label: string;
    value: AppointmentsOrdering;
    icon: string;
    dirName: string;
  }[] = [
    {
      label: 'Distance',
      icon: '↑',
      dirName: 'Ascending',
      value: {
        by: 'distance',
        direction: 'ASC',
      },
    },
    {
      label: 'Distance',
      icon: '↓',
      dirName: 'Descending',
      value: {
        by: 'distance',
        direction: 'DESC',
      },
    },
    {
      label: 'Price',
      icon: '↑',
      dirName: 'Ascending',
      value: {
        by: 'price',
        direction: 'ASC',
      },
    },
    {
      label: 'Price',
      icon: '↓',
      dirName: 'Descending',
      value: {
        by: 'price',
        direction: 'DESC',
      },
    },
    {
      label: 'Date',
      icon: '↑',
      dirName: 'Ascending',
      value: {
        by: 'date',
        direction: 'ASC',
      },
    },
    {
      label: 'Date',
      icon: '↓',
      dirName: 'Descending',
      value: {
        by: 'date',
        direction: 'DESC',
      },
    },
  ];

  formGroup = new FormGroup({
    sportId: new FormControl<number | null>(null),
    minDate: new FormControl<Date | null>(null),
    maxDate: new FormControl<Date | null>(null),
    startTime: new FormControl<Date | null>(null),
    endTime: new FormControl<Date | null>(null),
    maxPricePerPlayer: new FormControl<number | null>(null),
    maxDistance: new FormControl<number | null>(null),
    onlyJoinable: new FormControl<boolean>(true),
    sorting: new FormControl<AppointmentsOrdering | null>(null),
  });

  // sports$: Observable<SportDto[]>;
  sportOptions: { name: string; sportId: number }[] = [];

  constructor(private store: Store) {
    this.store
      .select(sportFeature.selectAllSports)
      // this.store
      //   .select(upsFeature.selectMyUpses)
      //   .pipe(map((upses) => upses.map((ups) => ups.sport)))
      .subscribe((sports) => {
        this.sportOptions = [
          { name: 'Joinable (Default)', sportId: -1 },
          ...sports.map((sport) => ({ name: sport.name, sportId: sport.id })),
          { name: 'All sports', sportId: -2 },
        ];
      });
  }

  clear() {
    this.formGroup.setValue({
      minDate: null,
      maxDate: null,
      maxDistance: null,
      maxPricePerPlayer: null,
      sportId: null,
      sorting: null,
      startTime: null,
      endTime: null,
      onlyJoinable: true,
    });
  }

  applyFilters() {
    let sportId, filterByUpses;
    if (this.formGroup.controls.sportId.value == -1) {
      sportId = null;
      filterByUpses = true;
    } else if (this.formGroup.controls.sportId.value == -2) {
      sportId = null;
      filterByUpses = false;
    } else {
      sportId = this.formGroup.controls.sportId.value;
      if (sportId == null) {
        filterByUpses = true;
      } else {
        filterByUpses = false;
      }
    }

    const filters: UserConfigurableFilters = {
      maxDistance: this.formGroup.controls.maxDistance.value,
      maxPrice: this.formGroup.controls.maxPricePerPlayer.value,
      minTime: this.formGroup.controls.startTime.value
        ? timeStringFromDate(this.formGroup.controls.startTime.value)
        : null,
      maxTime: this.formGroup.controls.endTime.value
        ? timeStringFromDate(this.formGroup.controls.endTime.value)
        : null,
      minDate: this.formGroup.controls.minDate.value
        ? dateStringFromDate(this.formGroup.controls.minDate.value)
        : null,
      maxDate: this.formGroup.controls.maxDate.value
        ? dateStringFromDate(this.formGroup.controls.maxDate.value)
        : null,
      sportId,
      filterByUpses,
    };

    this.store.dispatch(
      filtersChanged({
        data: {
          filters,
          ordering: this.formGroup.controls.sorting.value,
        },
      })
    );
    this.onClose.emit();
  }
}
