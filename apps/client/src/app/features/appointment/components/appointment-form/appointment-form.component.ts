import { CommonModule } from '@angular/common';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Store } from '@ngrx/store';
import {
  CreateAppointmentDto,
  createAppointmentSchema,
  Environment,
  LocationSuggestionDto,
  SportDto,
  SurfaceDto,
} from '@rwa/shared';
import { MessageService } from 'primeng/api';
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
import { MessagesModule } from 'primeng/messages';
import { SelectButtonModule } from 'primeng/selectbutton';
import { SliderModule } from 'primeng/slider';
import { TooltipModule } from 'primeng/tooltip';
import { Nullable } from 'primeng/ts-helpers';
import {
  EMPTY,
  exhaustMap,
  map,
  Observable,
  of,
  Subject,
  take,
  tap,
} from 'rxjs';
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
import { AppointmentService } from '../../services/appointment/appointment.service';
import {
  createAppointment,
  updateAppointment,
} from '../../store/appointment.actions';
import { appointmentFeature } from '../../store/appointment.feature';
import { upsFeature } from '../../../ups/store/ups.feature';

@Component({
  selector: 'app-appointment-form',
  standalone: true,
  imports: [
    MessagesModule,
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
    totalPlayers: new FormControl<number>(2),
    missingPlayers: new FormControl<number>(1),
    pricePerPlayer: new FormControl<number>(0),
    additionalInformation: new FormControl<string>(''),
  });

  suggestions: LocationSuggestionDto[] = [];

  sports$: Observable<SportDto[]>;
  surfaces$: Observable<SurfaceDto[]>;

  id: number | null = null;

  constructor(
    private store: Store,
    private locationService: LocationService,
    private messageService: MessageService,
    private appointmentService: AppointmentService,
    private route: ActivatedRoute
  ) {
    // this.sports$ = this.store.select(sportFeature.selectAllSports);
    this.sports$ = this.store
      .select(upsFeature.selectMyUpses)
      .pipe(map((upses) => upses.map((ups) => ups.sport)));
    this.surfaces$ = this.store.select(surfaceFeature.selectAll);
  }

  ngOnInit(): void {
    this.route.queryParamMap
      .pipe(
        map((map) => {
          const id = map.get('id');
          if (id !== null) {
            try {
              return parseInt(id);
            } catch {
              return null;
            }
          }
          return null;
        }),
        tap((id) => {
          this.id = id;
        }),
        exhaustMap((id) => {
          if (id === null) return EMPTY;

          return this.store
            .select(appointmentFeature.selectAppointmentById(id))
            .pipe(
              take(1),
              exhaustMap((val) => {
                if (val !== undefined) {
                  return of(val);
                } else {
                  return this.appointmentService.getAppointment(id);
                }
              })
            );
        })
      )
      .subscribe((appointment) => {
        if (appointment === undefined) {
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
    this.locationService.getSuggestions(event.query).subscribe((res) => {
      if (res != null) {
        this.suggestions = res.predictions;
      } else {
        this.suggestions = [];
      }
    });
  }

  async submit() {
    this.messageService.clear();

    const values = this.formGroup.getRawValue();

    if (
      values.age === null ||
      values.date === null ||
      values.durationHours === null ||
      values.durationMinutes === null ||
      values.environment === null ||
      values.location === null ||
      values.missingPlayers === null ||
      values.pricePerPlayer === null ||
      values.selectedSport === null ||
      values.selectedSurface === null ||
      values.skill === null ||
      values.totalPlayers === null ||
      values.startTime === null
    ) {
      this.showError('There are empty fields that need to be filled out');
      return;
    }

    const dto: CreateAppointmentDto = {
      additionalInformation: values.additionalInformation ?? '',
      date: toPostgresDateString(values.date),
      duration: toPostgresIntervalString({
        hours: values.durationHours,
        minutes: values.durationMinutes,
      }),
      environment: values.environment,
      locationId: values.location.place_id,
      minAge: values.age[0],
      maxAge: values.age[1],
      minSkillLevel: values.skill[0],
      maxSkillLevel: values.skill[1],
      missingPlayers: values.missingPlayers,
      pricePerPlayer: values.pricePerPlayer,
      sportId: values.selectedSport.id,
      startTime: toPostgresTimeString(values.startTime),
      surfaceId: values.selectedSurface.id,
      totalPlayers: values.totalPlayers,
    };

    const res = await createAppointmentSchema.safeParseAsync(dto);
    if (res.success) {
      if (this.id === null) {
        this.store.dispatch(createAppointment({ data: res.data }));
      } else {
        this.store.dispatch(
          updateAppointment({
            data: {
              id: this.id,
              changes: res.data,
            },
          })
        );
      }
    } else {
      if (res.error.errors.length > 0) {
        this.showError(res.error.errors[0].message);
      }
      return;
    }
  }

  showError(err: string) {
    this.messageService.add({
      key: 'appoi_form',
      severity: 'error',
      summary: err,
    });
  }

  clampMissingPlayers(a: string | number | null, b: Nullable<number>) {
    if (typeof a == 'string' || typeof a == 'object') {
      return b;
    }

    if (!b) {
      return 0;
    }

    return Math.min(a, b);
  }
}
