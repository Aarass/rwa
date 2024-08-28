import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { UserDto, UserInfo } from '@rwa/shared';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  constructor(private http: HttpClient) {}

  getUserInfoById(id: number) {
    return this.http.get<UserInfo>(`http://localhost:3000/users/${id}/verbose`);
  }
}
