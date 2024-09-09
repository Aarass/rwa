import { CommonModule } from '@angular/common';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Store } from '@ngrx/store';
import {
  CreateAppointmentDto,
  Environment,
  LocationSuggestionDto,
  SportDto,
  SurfaceDto,
} from '@rwa/shared';
import {
  AutoCompleteCompleteEvent,
  AutoCompleteModule,
} from 'primeng/autocomplete';
import { ButtonModule } from 'primeng/button';
import { CalendarModule } from 'primeng/calendar';
import { CardModule } from 'primeng/card';
import { DropdownModule } from 'primeng/dropdown';
import { FloatLabelModule } from 'primeng/floatlabel';
import { InputNumberModule } from 'primeng/inputnumber';
import { InputTextModule } from 'primeng/inputtext';
import { InputTextareaModule } from 'primeng/inputtextarea';
import { SelectButtonModule } from 'primeng/selectbutton';
import { SliderModule } from 'primeng/slider';
import { TooltipModule } from 'primeng/tooltip';
import { EMPTY, exhaustMap, Subject, take, takeUntil } from 'rxjs';
import {
  dateDateFromPostgresString,
  roundTime,
  timeDateFromPostgresString,
  toPostgresDateString,
  toPostgresIntervalString,
  toPostgresTimeString,
} from '../../../global/functions/date-utility';
import { LocationService } from '../../../location/services/location/location.service';
import { sportFeature } from '../../../sport/store/sport.feature';
import { surfaceFeature } from '../../../surface/store/surface.feature';
import {
  createAppointment,
  updateAppointment,
} from '../../store/appointment.actions';
import { appointmentFeature } from '../../store/appointment.feature';

@Component({
  selector: 'app-appointment-form',
  standalone: true,
  imports: [
    CommonModule,
    AutoCompleteModule,
    FloatLabelModule,
    InputTextModule,
    ButtonModule,
    SelectButtonModule,
    TooltipModule,
    CardModule,
    DropdownModule,
    ReactiveFormsModule,
    SliderModule,
    CalendarModule,
    InputNumberModule,
    InputTextareaModule,
  ],
  templateUrl: './appointment-form.component.html',
  styleUrl: './appointment-form.component.scss',
})
export class AppointmentFormComponent implements OnInit, OnDestroy {
  death = new Subject<void>();

  formGroup = new FormGroup({
    location: new FormControl<LocationSuggestionDto | null>(null),
    selectedSport: new FormControl<SportDto | null>(null),
    selectedSurface: new FormControl<SurfaceDto | null>(null),
    age: new FormControl<number[]>([0, 100]),
    skill: new FormControl<number[]>([1, 5]),
    date: new FormControl<Date>(new Date()),
    environment: new FormControl<Environment>(Environment.Outdoor),
    startTime: new FormControl<Date>(roundTime(new Date())),
    durationHours: new FormControl<number>(1),
    durationMinutes: new FormControl<number>(0),
    totalPlayers: new FormControl<number>(1),
    missingPlayers: new FormControl<number>(0),
    pricePerPlayer: new FormControl<number>(0),
    additionalInformation: new FormControl<string>(''),
  });

  suggestions: LocationSuggestionDto[] = [];

  sports: SportDto[] = [];
  surfaces: SurfaceDto[] = [];

  id: string | null = null;

  constructor(
    private store: Store,
    private locationService: LocationService,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.store
      .select(sportFeature.selectAllSports)
      .pipe(takeUntil(this.death))
      .subscribe((sports) => {
        this.sports = sports;
      });

    this.store
      .select(surfaceFeature.selectAll)
      .pipe(takeUntil(this.death))
      .subscribe((surfaces) => {
        this.surfaces = surfaces;
      });

    this.route.queryParamMap
      .pipe(
        take(1),
        exhaustMap((map) => {
          this.id = map.get('id');
          return this.id == null
            ? EMPTY
            : this.store
                .select(
                  appointmentFeature.selectAppointmentById(parseInt(this.id))
                )
                .pipe(take(2));
        })
      )
      .subscribe((appointment) => {
        if (appointment == undefined) {
          console.error('');
          return;
        }

        this.formGroup.controls.location.setValue({
          description: appointment.location.name,
          place_id: appointment.location.id,
        });

        this.formGroup.controls.environment.setValue(appointment.environment);

        this.formGroup.controls.age.setValue([
          appointment.minAge,
          appointment.maxAge,
        ]);
        this.formGroup.controls.skill.setValue([
          appointment.minSkillLevel,
          appointment.maxSkillLevel,
        ]);
        this.formGroup.controls.date.setValue(
          dateDateFromPostgresString(appointment.date)
        );
        this.formGroup.controls.startTime.setValue(
          timeDateFromPostgresString(appointment.startTime)
        );
        this.formGroup.controls.durationHours.setValue(
          appointment.duration.hours
        );
        this.formGroup.controls.durationMinutes.setValue(
          appointment.duration.minutes
        );
        this.formGroup.controls.totalPlayers.setValue(appointment.totalPlayers);
        this.formGroup.controls.missingPlayers.setValue(
          appointment.missingPlayers
        );
        this.formGroup.controls.pricePerPlayer.setValue(
          appointment.pricePerPlayer
        );
        this.formGroup.controls.additionalInformation.setValue(
          appointment.additionalInformation
        );
        this.formGroup.controls.selectedSport.setValue(appointment.sport);
        this.formGroup.controls.selectedSurface.setValue(appointment.surface);
      });
  }

  ngOnDestroy(): void {
    this.death.next();
    this.death.complete();
  }

  getLocationSuggestions(event: AutoCompleteCompleteEvent) {
    this.locationService
      .getSuggestions(event.query)
      .pipe(take(1))
      .subscribe((res) => {
        if (res != null) {
          this.suggestions = res.predictions;
        } else {
          this.suggestions = [];
        }
      });
  }

  submit() {
    const dto: CreateAppointmentDto = {
      additionalInformation:
        this.formGroup.controls.additionalInformation.value!,
      date: toPostgresDateString(this.formGroup.controls.date.value!),
      duration: toPostgresIntervalString({
        hours: this.formGroup.controls.durationHours.value!,
        minutes: this.formGroup.controls.durationMinutes.value!,
      }),
      environment: this.formGroup.controls.environment.value!,
      locationId: this.formGroup.controls.location.value!.place_id,
      minAge: this.formGroup.controls.age.value![0],
      maxAge: this.formGroup.controls.age.value![1],
      minSkillLevel: this.formGroup.controls.skill.value![0],
      maxSkillLevel: this.formGroup.controls.skill.value![1],
      missingPlayers: this.formGroup.controls.missingPlayers.value!,
      pricePerPlayer: this.formGroup.controls.pricePerPlayer.value!,
      sportId: this.formGroup.controls.selectedSport.value!.id,
      startTime: toPostgresTimeString(this.formGroup.controls.startTime.value!),
      surfaceId: this.formGroup.controls.selectedSurface.value!.id,
      totalPlayers: this.formGroup.controls.totalPlayers.value!,
    };

    if (this.id == null) {
      this.store.dispatch(createAppointment({ data: dto }));
    } else {
      this.store.dispatch(
        updateAppointment({
          data: {
            id: parseInt(this.id),
            changes: dto,
          },
        })
      );
    }
  }
}
