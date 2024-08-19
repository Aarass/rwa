import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AppointmentDto } from '@rwa/shared';

@Component({
  selector: 'app-appointment',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './appointment.component.html',
  styleUrl: './appointment.component.scss',
})
export class AppointmentComponent {
  @Input()
  appointment!: AppointmentDto;
}
