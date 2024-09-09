import { CommonModule } from '@angular/common';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { ButtonModule } from 'primeng/button';
import { CalendarModule } from 'primeng/calendar';
import { CardModule } from 'primeng/card';
import { FloatLabelModule } from 'primeng/floatlabel';
import { InputTextModule } from 'primeng/inputtext';
import { InputTextareaModule } from 'primeng/inputtextarea';
import { MessagesModule } from 'primeng/messages';
import { PanelModule } from 'primeng/panel';
import { PasswordModule } from 'primeng/password';
import { StepperModule } from 'primeng/stepper';

import {
  LocationSuggestionDto,
  RegisterUserDto,
  createUserSchema as registerUserSchema,
} from '@rwa/shared';
import {
  AutoCompleteCompleteEvent,
  AutoCompleteModule,
} from 'primeng/autocomplete';
import { Subject, take, takeUntil } from 'rxjs';
import { LocationService } from '../../../location/services/location/location.service';

import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { Store } from '@ngrx/store';
import { MessageService } from 'primeng/api';
import { register } from '../../store/auth.actions';
import { authFeature } from '../../store/auth.feature';
import { Router } from '@angular/router';
import { selectUser } from '../../../user/store/user.feature';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [
    CommonModule,
    InputTextModule,
    ButtonModule,
    PasswordModule,
    CalendarModule,
    PanelModule,
    AutoCompleteModule,
    ReactiveFormsModule,
    MessagesModule,
    CardModule,
    FloatLabelModule,
    StepperModule,
    InputTextareaModule,
  ],
  templateUrl: './register.component.html',
  styleUrl: './register.component.scss',
})
export class RegisterComponent implements OnInit, OnDestroy {
  formGroup = new FormGroup({
    username: new FormControl(''),
    password: new FormControl(''),
    confirmPassword: new FormControl(''),
    name: new FormControl(''),
    surname: new FormControl(''),
    phoneNumber: new FormControl(''),
    birthDate: new FormControl<Date | null>(null),
    biography: new FormControl(''),
    location: new FormControl<LocationSuggestionDto | null>(null),
  });

  suggestions: LocationSuggestionDto[] = [];

  death = new Subject<void>();
  loading: boolean = false;

  constructor(
    private messageService: MessageService,
    private locationService: LocationService,
    private store: Store,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.store
      .select(authFeature.selectIsCurrentlyRegistering)
      .pipe(takeUntil(this.death))
      .subscribe((val) => {
        this.loading = val;
      });

    selectUser(this.store)
      .pipe(takeUntil(this.death))
      .subscribe((data) => {
        if (data != null) {
          this.router.navigateByUrl('appointments');
        }
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

  async submit() {
    const values = this.formGroup.getRawValue();

    if (
      values.biography === null ||
      values.birthDate === null ||
      values.location === null ||
      values.name === null ||
      values.password === null ||
      values.phoneNumber === null ||
      values.surname === null ||
      values.username === null
    ) {
      this.messageService.clear('register');
      this.messageService.add({
        key: 'register',
        severity: 'error',
        summary:
          'GLOBAL' + ': ' + 'There are empty fields that need to be filled out',
      });
      return;
    }

    if (values.location.place_id === undefined) {
      this.messageService.clear('register');
      this.messageService.add({
        key: 'register',
        severity: 'error',
        summary: 'LOCATION' + ': ' + 'Invalid location',
      });
      return;
    }

    const registerUserDto: RegisterUserDto = {
      biography: values.biography,
      birthDate: values.birthDate.toISOString().split('T')[0],
      locationId: values.location.place_id,
      name: values.name,
      password: values.password,
      phoneNumber: values.phoneNumber,
      surname: values.surname,
      username: values.username,
    };

    const zodResult = await registerUserSchema.safeParseAsync(registerUserDto);

    if (zodResult.success === false) {
      const error = zodResult.error.errors[0];
      this.messageService.clear('register');
      this.messageService.add({
        key: 'register',
        severity: 'error',
        summary: error.path.toString().toUpperCase() + ': ' + error.message,
      });
      return;
    }

    this.messageService.clear('register');
    this.loading = true;

    this.store.dispatch(register(registerUserDto));
    return;
  }
}
