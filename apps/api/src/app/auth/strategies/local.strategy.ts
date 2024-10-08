import { Strategy as LocalPassportStrategy } from 'passport-local';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { AuthService } from '../auth.service';
import { User } from '@rwa/entities';

@Injectable()
export class LocalStrategy extends PassportStrategy(LocalPassportStrategy) {
  constructor(private authService: AuthService) {
    super();
  }

  async validate(username: string, password: string): Promise<User> {
    const user = await this.authService.getUserWithCredentials(
      username,
      password
    );

    if (user == null) {
      throw new UnauthorizedException('Invalid credentials');
    }

    return user;
  }
}
