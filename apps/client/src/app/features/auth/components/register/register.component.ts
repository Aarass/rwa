import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
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

import { LocationSuggestionDto } from '@rwa/shared';
import { CreateUserDto } from '@rwa/shared';
import { createUserSchema } from '@rwa/shared';
import {
  AutoCompleteCompleteEvent,
  AutoCompleteModule,
} from 'primeng/autocomplete';
import { take } from 'rxjs';
import { LocationService } from '../../../location/services/location/location.service';

import {
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { Message } from 'primeng/api';
import { AuthService } from '../../services/auth/auth.service';

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
export class RegisterComponent {
  formGroup = new FormGroup({
    username: new FormControl('', [Validators.required]),
    password: new FormControl(''),
    name: new FormControl(''),
    surname: new FormControl(''),
    phoneNumber: new FormControl(''),
    birthDate: new FormControl(''),
    biography: new FormControl(''),
    location: new FormControl<LocationSuggestionDto | null>(null),
  });
  suggestions: LocationSuggestionDto[] = [];
  messages: Message[] = [];

  constructor(
    private locationService: LocationService,
    private authService: AuthService
  ) {}

  getLocationSuggestions(event: AutoCompleteCompleteEvent) {
    this.locationService
      .getSuggestions(event.query)
      .pipe(take(1))
      .subscribe((res) => {
        this.suggestions = res.predictions;
      });
  }

  submit() {
    const { location, ...rest } = this.formGroup.getRawValue();

    if (
      location === null ||
      rest.biography === null ||
      rest.username === null ||
      rest.password === null ||
      rest.name === null ||
      rest.surname === null ||
      rest.birthDate === null
    ) {
      return;
    }

    if (rest.username != null) {
      const createUserDto: any = {
        ...rest,
        locationId: location.place_id,
      };
      const output = createUserSchema.parse(createUserDto);
      console.log(output);
    }
  }
}
