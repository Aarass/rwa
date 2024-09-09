import {
  BadRequestException,
  ForbiddenException,
  HttpException,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import {
  AccessToken,
  CreateUserDto,
  RefreshToken,
  RefreshTokenPayload,
  TokenUser,
} from '@rwa/shared';
import * as bcrypt from 'bcrypt';
import { User } from '@rwa/entities';
import { UserService } from '../user/user.service';

@Injectable()
export class AuthService {
  constructor(
    private userService: UserService,
    private jwtService: JwtService
  ) {}

  async getUserWithCredentials(username: string, password: string) {
    const user = await this.userService.getUserByUsername(username);
    if (user == null) {
      return null;
    }

    const passwordsMatch = await bcrypt.compare(password, user.passwordHash);
    if (!passwordsMatch) {
      return null;
    }

    return user;
  }

  // async getMe(accessToken: AccessToken): Promise<User> {
  //   const payload: AccessTokenPayload = this.jwtService.verify(accessToken);

  //   const user = await this.userService.getUserById(payload.sub);

  //   if (user == null) {
  //     // Kapiram da ovo moze da se desi ako se user izbrise, u drugim slucajevima mislim da je bug
  //     console.error(`Couldn't find user with id found in refresh token\n`);
  //     throw new InternalServerErrorException();
  //   }

  //   return user;
  // }

  async login(user: User) {
    const accessToken = await this.createAccessToken(user);
    const refreshToken = await this.createRefreshToken(user.id);

    await this.setRefreshToken(user.id, refreshToken);

    return { accessToken, refreshToken };
  }

  async register(newUser: CreateUserDto) {
    const user = await this.userService.createUser(newUser);
    const refreshToken = await this.createRefreshToken(user.id);

    await this.setRefreshToken(user.id, refreshToken);
  }

  async refresh(
    refreshToken: RefreshToken
  ): Promise<{ newAccessToken: AccessToken; newRefreshToken: RefreshToken }> {
    let payload: RefreshTokenPayload;
    try {
      payload = this.jwtService.verify(refreshToken);
    } catch (e) {
      throw new ForbiddenException('Invalid token');
    }

    const user = await this.userService.getUserById(payload.sub);

    if (user == null) {
      // Kapiram da ovo moze da se desi ako se user izbrise, u drugim slucajevima mislim da je bug
      throw new InternalServerErrorException(
        `Couldn't find user with id found in refresh token\n`
      );
    }

    if (user.refreshTokenHash == null) {
      throw new ForbiddenException(`User has no refresh token stored in db`);
    }

    const tokenIsValid = await bcrypt.compare(
      refreshToken,
      user.refreshTokenHash
    );

    if (!tokenIsValid) {
      await this.revokeRefreshToken(user.id);
      throw new ForbiddenException(
        `User attempted to use different refresh token than the one stored in db`
      );
    }

    const newAccessToken = await this.createAccessToken(user);
    const newRefreshToken = await this.createRefreshToken(user.id);

    await this.setRefreshToken(user.id, newRefreshToken);

    return { newAccessToken, newRefreshToken };
  }

  async logout(refreshToken: RefreshToken) {
    let payload: RefreshTokenPayload;
    try {
      payload = await this.jwtService.verifyAsync(refreshToken);
    } catch (err) {
      throw new BadRequestException('Problem with refresh token');
    }

    await this.revokeRefreshToken(payload.sub);
  }

  private async setRefreshToken(userId: number, refreshToken: RefreshToken) {
    await this.userService.setUserRefreshToken(userId, refreshToken);
  }

  private async revokeRefreshToken(userId: number) {
    await this.userService.setUserRefreshToken(userId, '');
  }

  private async createAccessToken(user: User): Promise<AccessToken> {
    const tokenUser: TokenUser = {
      id: user.id,
      roles: user.roles,
    };
    try {
      const access_token = await this.jwtService.signAsync(
        { user: tokenUser },
        {
          // expiresIn: '10sec',
          expiresIn: '10m',
        }
      );
      return access_token;
    } catch (err) {
      console.log('Error while signing access token', err);
      return '';
    }
  }

  private async createRefreshToken(userId: number): Promise<RefreshToken> {
    const refresh_token = await this.jwtService.signAsync(
      { id: userId },
      {
        expiresIn: '7d',
      }
    );

    return refresh_token;
  }
}
