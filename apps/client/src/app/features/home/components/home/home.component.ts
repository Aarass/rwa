import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Component } from '@angular/core';
import { ButtonModule } from 'primeng/button';
import { firstValueFrom } from 'rxjs';
import { ConfigService } from '../../../global/services/config/config.service';
import { Store } from '@ngrx/store';
import { sportFeature } from '../../../sport/store/sport.feature';
import { upsFeature } from '../../../ups/store/ups.feature';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, ButtonModule, RouterModule],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss',
})
export class HomeComponent {
  constructor(
    private configService: ConfigService,
    private http: HttpClient,
    private store: Store
  ) {}
  async test() {
    const res = await firstValueFrom(
      this.http.get(`${this.configService.getBackendBaseURL()}/ups/user/me`, {})
    );
    console.log(res);
  }
  async test2() {
    const missing = await firstValueFrom(
      this.store.select(upsFeature.selectSportsIDontPlay)
    );

    const played = await firstValueFrom(
      this.store.select(upsFeature.selectMyUpses)
    );

    console.log(missing);
    console.log(played);
  }
}
