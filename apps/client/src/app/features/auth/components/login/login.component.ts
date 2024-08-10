import { CommonModule } from '@angular/common';
import {
  Component,
  EventEmitter,
  OnDestroy,
  OnInit,
  Output,
} from '@angular/core';
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
import { filter, Subject, takeUntil, tap } from 'rxjs';
import { login } from '../../store/auth.actions';
import { AuthStatus } from '../../store/auth.state';
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
export class LoginComponent implements OnInit, OnDestroy {
  @Output() close = new EventEmitter<void>();

  formGroup = new FormGroup({
    usernameControl: new FormControl<string>('', [Validators.required]),
    passwordControl: new FormControl<string>('', [Validators.required]),
  });

  death = new Subject<void>();
  loading: boolean = false;

  constructor(private store: Store, private messageService: MessageService) {}

  ngOnInit(): void {
    this.store
      .select(authFeature.selectIsCurrentlyLoggingIn)
      .pipe(takeUntil(this.death))
      .subscribe((val) => {
        this.loading = val;
      });

    this.store
      .select(authFeature.selectStatus)
      .pipe(
        takeUntil(this.death),
        filter((val) => {
          return val == AuthStatus.LoggedIn;
        })
      )
      .subscribe((val) => {
        this.close.emit();
      });
  }

  ngOnDestroy(): void {
    this.death.next();
    this.death.complete();
  }

  submit() {
    if (this.formGroup.valid) {
      this.store.dispatch(
        login({
          username: this.formGroup.controls.usernameControl.value!,
          password: this.formGroup.controls.passwordControl.value!,
        })
      );
    } else {
      // TODO
      // Prikazivanje gresaksa
    }
  }

  cancel() {
    this.messageService.clear('login');
    this.loading = false;
    this.close.emit();
  }
}
