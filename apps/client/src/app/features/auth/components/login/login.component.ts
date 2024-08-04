import { CommonModule } from '@angular/common';
import { HttpErrorResponse } from '@angular/common/http';
import { Component, EventEmitter, Output } from '@angular/core';
import {
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { MessageService } from 'primeng/api';
import { ButtonModule } from 'primeng/button';
import { FloatLabelModule } from 'primeng/floatlabel';
import { InputTextModule } from 'primeng/inputtext';
import { MessagesModule } from 'primeng/messages';
import { PasswordModule } from 'primeng/password';
import { ToastModule } from 'primeng/toast';
import { catchError, EMPTY, take } from 'rxjs';
import { AuthService } from '../../services/auth/auth.service';

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
  @Output()
  close = new EventEmitter<void>();

  loading: boolean = false;

  formGroup = new FormGroup({
    usernameControl: new FormControl<string>('', [Validators.required]),
    passwordControl: new FormControl<string>('', [Validators.required]),
  });

  constructor(
    private messageService: MessageService,
    private authService: AuthService
  ) {}

  submit() {
    console.log(this.formGroup.getRawValue());

    if (this.formGroup.valid) {
      this.loading = true;

      this.authService
        .login(
          this.formGroup.controls.usernameControl.value!,
          this.formGroup.controls.passwordControl.value!
        )
        .pipe(
          take(1),
          catchError((err: HttpErrorResponse) => {
            this.messageService.add({
              key: 'login',
              severity: 'error',
              summary: err.error.message,
            });

            this.loading = false;
            return EMPTY;
          })
        )
        .subscribe((res) => {
          this.messageService.clear('login');
          this.messageService.add({
            key: 'global',
            severity: 'success',
            summary: 'Successfully signed in',
          });
          this.loading = false;
          this.formGroup.reset();
          this.close.emit();
        });
    } else {
      this.loading = false;
    }
  }

  cancel() {
    this.messageService.clear('login');
    this.loading = false;
    this.close.emit();
  }
}
