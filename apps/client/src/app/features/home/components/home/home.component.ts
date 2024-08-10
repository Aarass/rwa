import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Component } from '@angular/core';
import { ButtonModule } from 'primeng/button';
import { firstValueFrom } from 'rxjs';
import { ConfigService } from '../../../global/services/config/config.service';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, ButtonModule],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss',
})
export class HomeComponent {
  constructor(private configService: ConfigService, private http: HttpClient) {}
  async test() {
    const res = await firstValueFrom(
      this.http.get(`${this.configService.getBackendBaseURL()}/ups/user/me`, {})
    );
    console.log(res);
  }
}
