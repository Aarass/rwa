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
import { combineLatest, map } from 'rxjs';
import { authFeature } from '../../../auth/store/auth.feature';
import {
  roundTime,
  toPostgresDateString,
  toPostgresTimeString,
} from '../../../global/functions/date-utility';
import { upsFeature } from '../../../ups/store/ups.feature';
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
  @Output()
  close = new EventEmitter<void>();

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

  sportOptions: { name: string; sportId: number }[] = [];

  constructor(private store: Store) {
    // const sports$ = this.store.select(sportFeature.selectAllSports);
    const sports$ = this.store
      .select(upsFeature.selectMyUpses)
      .pipe(map((upses) => upses.map((ups) => ups.sport)));
    const isAdmin$ = this.store.select(authFeature.selectIsAdmin);
    combineLatest([sports$, isAdmin$]).subscribe((tuple) => {
      const [sports, isAdmin] = tuple;

      this.sportOptions = [
        ...sports.map((sport) => ({ name: sport.name, sportId: sport.id })),
      ];

      if (isAdmin) {
        this.sportOptions.push({ name: 'All (Debug)', sportId: -1 });
      }
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
    let sportId = this.formGroup.controls.sportId.value;
    let filterByUpses = true;

    if (sportId === -1) {
      sportId = null;
      filterByUpses = false;
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
    this.close.emit();
  }

  firstTimeStartTime() {
    if (this.formGroup.controls.startTime.value === null) {
      this.formGroup.controls.startTime.setValue(roundTime(new Date()));
    }
  }

  firstTimeEndTime() {
    if (this.formGroup.controls.endTime.value === null) {
      if (this.formGroup.controls.startTime.value === null) {
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
