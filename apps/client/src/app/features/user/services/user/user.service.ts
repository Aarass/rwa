import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { UserDto, UserInfo } from '@rwa/shared';
import { ConfigService } from '../../../global/services/config/config.service';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  constructor(private http: HttpClient, private configService: ConfigService) {}

  getUserById(id: number) {
    return this.http.get<UserDto>(
      `${this.configService.getBackendBaseURL()}/users/${id}`
    );
  }

  getMe() {
    return this.http.get<UserDto>(
      `${this.configService.getBackendBaseURL()}/users/me`
    );
  }

  getUserInfoById(id: number) {
    return this.http.get<UserInfo>(
      `${this.configService.getBackendBaseURL()}/users/${id}/verbose`
    );
  }
}
