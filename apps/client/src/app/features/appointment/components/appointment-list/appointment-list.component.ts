import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-appointment-list',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './appointment-list.component.html',
  styleUrl: './appointment-list.component.scss',
})
export class AppointmentListComponent {}
