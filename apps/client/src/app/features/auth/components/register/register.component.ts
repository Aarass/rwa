import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { InputTextModule } from 'primeng/inputtext';
import { ButtonModule } from 'primeng/button';
import { PasswordModule } from 'primeng/password';
import { CalendarModule } from 'primeng/calendar';
import { MessagesModule } from 'primeng/messages';
import { PanelModule } from 'primeng/panel';
import { CardModule } from 'primeng/card';
import { FloatLabelModule } from 'primeng/floatlabel';
import { StepperModule } from 'primeng/stepper';
import { InputTextareaModule } from 'primeng/inputtextarea';

import {
  AutoCompleteCompleteEvent,
  AutoCompleteModule,
} from 'primeng/autocomplete';
import { LocationService } from '../../../location/services/location/location.service';
import { firstValueFrom } from 'rxjs';
import { LocationSuggestionDto } from '@rwa/shared';
import {
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { Message } from 'primeng/api';

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
    usernameControl: new FormControl('', [Validators.required]),
    passwordControl: new FormControl(''),
    nameControl: new FormControl(''),
    surnameControl: new FormControl(''),
    phoneNumberControl: new FormControl(''),
    birthDateControl: new FormControl(''),
    biographyControl: new FormControl(''),
    locationControl: new FormControl<LocationSuggestionDto | null>(null),
  });
  suggestions: LocationSuggestionDto[] = [];
  messages: Message[] = [];

  constructor(private locationService: LocationService) {}

  async getLocationSuggestions(event: AutoCompleteCompleteEvent) {
    const res = await firstValueFrom(
      this.locationService.getSuggestions(event.query)
    );

    this.suggestions = res.predictions;
  }

  test() {
    console.log(this.formGroup.getRawValue());
    this.formGroup.controls.usernameControl.setValue('asga');
    this.messages = [
      { severity: 'info', summary: 'Dynamic Info Message' },
      { severity: 'success', summary: 'Dynamic Success Message' },
      { severity: 'warn', summary: 'Dynamic Warning Message' },
    ];

    this.messages.push({
      severity: 'error',
      summary: 'Sjebo si',
    });
  }
}
