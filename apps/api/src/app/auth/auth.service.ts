import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { AccessToken, CreateUserDto, RefreshToken } from '@rwa/shared';
import * as bcrypt from 'bcrypt';
import { User } from '../user/models/user';
import { UserService } from '../user/user.service';

@Injectable()
export class AuthService {
  constructor(
    private userService: UserService,
    private jwtService: JwtService
  ) {}

  async validateUser(username: string, password: string) {
    const user = await this.userService.getUserByUsername(username);
    if (user == null) {
      return null;
    }

    const passwordsMatch = await bcrypt.compare(password, user.passwordHash);
    if (!passwordsMatch) {
      return null;
    }

    const { passwordHash, ...result } = user;
    return result;
  }

  async createSession(user: User) {
    const accessToken = await this.createAccessToken({
      username: user.username,
      sub: user.id,
    });
    const refreshToken = await this.createRefreshToken({ sub: user.id });

    if (accessToken == null || refreshToken == null) {
      const err = new Error(`Couldn't create tokens`);
      console.error(err);
      throw new InternalServerErrorException(err);
    }

    await this.userService.setUserRefreshToken(user.id, refreshToken);

    return { accessToken, refreshToken };
  }

  async register(newUser: CreateUserDto) {
    return await this.userService.createUser(newUser);
  }

  async refreshSession(
    refreshToken: RefreshToken
  ): Promise<{ newAccessToken: AccessToken; newRefreshToken: RefreshToken }> {}

  async createAccessToken(payload: any) {
    try {
      const access_token = await this.jwtService.signAsync(payload, {
        expiresIn: '10m',
      });
      return access_token;
    } catch (err) {
      console.error(err);
      return null;
    }
  }

  async createRefreshToken(payload: any) {
    try {
      const refresh_token = await this.jwtService.signAsync(payload, {
        expiresIn: '7d',
      });
      return refresh_token;
    } catch (err) {
      console.error(err);
      return null;
    }
  }
}
