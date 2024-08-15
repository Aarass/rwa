import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SpeedDialModule } from 'primeng/speeddial';
import { MenuItem } from 'primeng/api';
import { ButtonModule } from 'primeng/button';
import { UpsListComponent } from '../../../ups/components/ups-list/ups-list.component';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [CommonModule, SpeedDialModule, ButtonModule, UpsListComponent],
  templateUrl: './profile.component.html',
  styleUrl: './profile.component.scss',
})
export class ProfileComponent {}
