import { Injectable } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { UserService } from '../user/user.service';
import { JwtService } from '@nestjs/jwt';

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

  async createAccessToken() {
    return await this.jwtService.signAsync(
      {},
      {
        expiresIn: '1h',
        secret: process.env.JWT_SECRET,
      }
    );
  }

  async createRefreshToken() {
    return await this.jwtService.signAsync(
      {},
      {
        expiresIn: '7d',
        secret: process.env.JWT_SECRET,
      }
    );
  }
}
