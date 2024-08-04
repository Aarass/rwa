import { Component, OnInit } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { MessageService, PrimeNGConfig } from 'primeng/api';
import { MenubarModule } from 'primeng/menubar';
import { BadgeModule } from 'primeng/badge';
import { ToastModule } from 'primeng/toast';
import { AvatarModule } from 'primeng/avatar';
import { InputTextModule } from 'primeng/inputtext';
import { CommonModule } from '@angular/common';
import { RippleModule } from 'primeng/ripple';
import { ButtonModule } from 'primeng/button';
import { DialogModule } from 'primeng/dialog';
import { LoginComponent } from './features/auth/components/login/login.component';

@Component({
  standalone: true,
  imports: [
    RouterModule,
    MenubarModule,
    BadgeModule,
    AvatarModule,
    InputTextModule,
    RippleModule,
    CommonModule,
    ButtonModule,
    DialogModule,
    LoginComponent,
    ToastModule,
  ],
  providers: [MessageService],
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
})
export class AppComponent implements OnInit {
  visible: boolean = false;
  constructor(private primengConfig: PrimeNGConfig, private router: Router) {}

  ngOnInit() {
    this.primengConfig.ripple = true;
  }

  showSignInDialog() {
    this.visible = true;
  }

  goToSingUpPage() {
    this.router.navigate(['/register']);
  }

  profile() {
    alert();
  }
}
