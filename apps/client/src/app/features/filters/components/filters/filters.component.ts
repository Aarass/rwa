import { CommonModule } from '@angular/common';
import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { Store } from '@ngrx/store';
import { AppointmentsOrdering, SportDto } from '@rwa/shared';
import { CalendarModule } from 'primeng/calendar';
import { DropdownModule } from 'primeng/dropdown';
import { FloatLabelModule } from 'primeng/floatlabel';
import { InputNumberModule } from 'primeng/inputnumber';
import { SliderModule } from 'primeng/slider';
import { Observable } from 'rxjs';
import {
  dateStringFromDate,
  timeStringFromDate,
} from '../../../global/functions/date-utility';
import { sportFeature } from '../../../sport/store/sport.feature';
import { UserConfigurableFilters } from '../../interfaces/filters';
import { filtersChanged } from '../../store/filter.actions';

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
  ],
  templateUrl: './filters.component.html',
  styleUrl: './filters.component.scss',
})
export class FiltersComponent implements OnInit {
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
    selectedSport: new FormControl<SportDto | null>(null),
    minDate: new FormControl<Date | null>(null),
    maxDate: new FormControl<Date | null>(null),
    startTime: new FormControl<Date | null>(null),
    endTime: new FormControl<Date | null>(null),
    maxPricePerPlayer: new FormControl<number | null>(null),
    maxDistance: new FormControl<number | null>(null),
    sorting: new FormControl<AppointmentsOrdering | null>(null),
  });

  sports$: Observable<SportDto[]>;

  constructor(private store: Store) {
    this.sports$ = this.store.select(sportFeature.selectAllSports);
  }

  clear() {
    this.formGroup.setValue({
      minDate: null,
      maxDate: null,
      maxDistance: null,
      maxPricePerPlayer: null,
      selectedSport: null,
      sorting: null,
      startTime: null,
      endTime: null,
    });
  }

  applyFilters() {
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
      sportId: this.formGroup.controls.selectedSport.value?.id ?? null,
    };

    this.onClose.emit();
    this.store.dispatch(
      filtersChanged({
        data: {
          filters,
          ordering: this.formGroup.controls.sorting.value,
        },
      })
    );
  }

  ngOnInit(): void {}
}
