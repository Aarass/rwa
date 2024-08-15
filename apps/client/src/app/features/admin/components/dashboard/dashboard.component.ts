import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { DividerModule } from 'primeng/divider';
import { CreateSportComponent } from '../create-sport/create-sport.component';
import { CreateSurfaceComponent } from '../create-surface/create-surface.component';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [
    CommonModule,
    CreateSportComponent,
    CreateSurfaceComponent,
    DividerModule,
  ],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.scss',
})
export class DashboardComponent {}
