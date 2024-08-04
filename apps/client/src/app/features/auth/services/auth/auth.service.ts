import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { RegisterUserDto } from '@rwa/shared';
import { firstValueFrom } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  constructor(private http: HttpClient) {}

  register(registrationData: RegisterUserDto) {
    return this.http.post(
      'http://localhost:3000/auth/register',
      registrationData
    );
  }

  login(username: string, password: string) {
    return this.http.post('http://localhost:3000/auth/login', {
      username,
      password,
    });
  }
}
