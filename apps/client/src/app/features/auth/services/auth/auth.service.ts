import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { RegisterUserDto } from '@rwa/shared';
import { ConfigService } from '../../../global/services/config/config.service';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  constructor(private http: HttpClient, private configService: ConfigService) {}

  register(registrationData: RegisterUserDto) {
    return this.http.post(
      `${this.configService.getBackendBaseURL()}/auth/register`,
      registrationData
    );
  }

  login(username: string, password: string) {
    return this.http.post<{ accessToken: string }>(
      `${this.configService.getBackendBaseURL()}/auth/login`,
      {
        username,
        password,
      }
    );
  }

  refresh() {
    return this.http.post<{ accessToken: string }>(
      `${this.configService.getBackendBaseURL()}/auth/refresh`,
      {}
    );
  }
}
