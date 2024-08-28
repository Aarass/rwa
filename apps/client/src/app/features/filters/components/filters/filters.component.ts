import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Output } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { Store } from '@ngrx/store';
import { AppointmentsOrdering } from '@rwa/shared';
import { CalendarModule } from 'primeng/calendar';
import { CheckboxModule } from 'primeng/checkbox';
import { DropdownModule } from 'primeng/dropdown';
import { FloatLabelModule } from 'primeng/floatlabel';
import { InputGroupModule } from 'primeng/inputgroup';
import { InputNumberModule } from 'primeng/inputnumber';
import { SelectButtonModule } from 'primeng/selectbutton';
import { SliderModule } from 'primeng/slider';
import { ToggleButtonModule } from 'primeng/togglebutton';
import { Subject } from 'rxjs';
import {
  roundTime,
  toPostgresDateString,
  toPostgresTimeString,
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
    InputGroupModule,
    CheckboxModule,
    ToggleButtonModule,
    SelectButtonModule,
  ],
  templateUrl: './filters.component.html',
  styleUrl: './filters.component.scss',
})
export class FiltersComponent {
  death = new Subject<void>();

  @Output()
  onClose = new EventEmitter<void>();

  formGroup = new FormGroup({
    sportId: new FormControl<number | null>(null),
    minDate: new FormControl<Date | null>(null),
    maxDate: new FormControl<Date | null>(null),
    startTime: new FormControl<Date | null>(null),
    endTime: new FormControl<Date | null>(null),
    maxPricePerPlayer: new FormControl<number | null>(null),
    maxDistance: new FormControl<number | null>(null),
    onlyMine: new FormControl<boolean>(false),
    canceled: new FormControl<boolean>(false),
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
      onlyMine: false,
      canceled: false,
    });
  }

  applyFilters() {
    // let sportId, filterByUpses;
    // if (this.formGroup.controls.sportId.value == -1) {
    //   sportId = null;
    //   filterByUpses = true;
    // } else if (this.formGroup.controls.sportId.value == -2) {
    //   sportId = null;
    //   filterByUpses = false;
    // } else {
    //   sportId = this.formGroup.controls.sportId.value;
    //   if (sportId == null) {
    //     filterByUpses = true;
    //   } else {
    //     filterByUpses = false;
    //   }
    // }

    let sportId, filterByUpses;
    const value = this.formGroup.controls.sportId.value;
    if (value == -1) {
      sportId = null;
      filterByUpses = true;
    } else if (value == -2) {
      sportId = null;
      filterByUpses = false;
    } else {
      sportId = value;
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
        ? toPostgresTimeString(this.formGroup.controls.startTime.value)
        : null,
      maxTime: this.formGroup.controls.endTime.value
        ? toPostgresTimeString(this.formGroup.controls.endTime.value)
        : null,
      minDate: this.formGroup.controls.minDate.value
        ? toPostgresDateString(this.formGroup.controls.minDate.value)
        : null,
      maxDate: this.formGroup.controls.maxDate.value
        ? toPostgresDateString(this.formGroup.controls.maxDate.value)
        : null,
      sportId,
      filterByUpses,
      canceled: this.formGroup.controls.canceled.value,
      onlyMine: this.formGroup.controls.onlyMine.value ?? false,
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

  firstTimeStartTime() {
    if (this.formGroup.controls.startTime.value == null) {
      this.formGroup.controls.startTime.setValue(roundTime(new Date()));
    }
  }

  firstTimeEndTime() {
    if (this.formGroup.controls.endTime.value == null) {
      if (this.formGroup.controls.startTime.value == null) {
        this.formGroup.controls.endTime.setValue(roundTime(new Date()));
      } else {
        this.formGroup.controls.endTime.setValue(
          this.formGroup.controls.startTime.value
        );
      }
    }
  }

  clearDistance() {
    this.formGroup.controls.maxDistance.setValue(null);
  }
}
