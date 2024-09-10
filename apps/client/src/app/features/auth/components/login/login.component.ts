import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Output } from '@angular/core';
import {
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { Store } from '@ngrx/store';
import { MessageService } from 'primeng/api';
import { ButtonModule } from 'primeng/button';
import { FloatLabelModule } from 'primeng/floatlabel';
import { InputTextModule } from 'primeng/inputtext';
import { MessagesModule } from 'primeng/messages';
import { PasswordModule } from 'primeng/password';
import { ToastModule } from 'primeng/toast';
import { Observable } from 'rxjs';
import { login } from '../../store/auth.actions';
import { authFeature } from '../../store/auth.feature';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [
    CommonModule,
    InputTextModule,
    ButtonModule,
    PasswordModule,
    FloatLabelModule,
    MessagesModule,
    ReactiveFormsModule,
    ToastModule,
  ],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss',
})
export class LoginComponent {
  @Output() close = new EventEmitter<void>();

  loading$: Observable<boolean>;

  formGroup = new FormGroup({
    usernameControl: new FormControl<string>('', [Validators.required]),
    passwordControl: new FormControl<string>('', [Validators.required]),
  });

  constructor(private store: Store, private messageService: MessageService) {
    this.loading$ = this.store.select(authFeature.selectIsCurrentlyLoggingIn);
  }

  submit() {
    let { usernameControl: username, passwordControl: password } =
      this.formGroup.getRawValue();

    if (username === null || password === null) {
      return;
    }

    username = username.trim();
    password = password.trim();

    if (username === '' || password === '') {
      return;
    }

    this.store.dispatch(
      login({
        data: {
          username,
          password,
        },
      })
    );
  }

  onClose() {
    this.messageService.clear('login');
    this.close.emit();
  }
}
