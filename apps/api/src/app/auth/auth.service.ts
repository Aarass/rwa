import { Injectable } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { UserService } from '../user/user.service';
import { JwtService } from '@nestjs/jwt';
import { User } from '../user/models/user';

@Injectable()
export class AuthService {
  constructor(
    private userService: UserService,
    private jwtService: JwtService
  ) {}

  async validateUser(username: string, password: string) {
    const user = await this.userService.getUserByUsername(username);
    if (!user) {
      return null;
    }

    const passwordsMatch = await bcrypt.compare(password, user.passwordHash);
    if (!passwordsMatch) {
      return null;
    }

    const { passwordHash, ...result } = user;
    return result;
  }

  async login(user: User) {
    const payload = { username: user.username, sub: user.id };
    return {
      access_token: await this.createAccessToken(payload),
    };
  }

  async createAccessToken(payload: any) {
    return await this.jwtService.signAsync(payload, {
      expiresIn: '1h',
    });
  }

  async createRefreshToken(payload: any) {
    return await this.jwtService.signAsync(payload, {
      expiresIn: '7d',
    });
  }
}
