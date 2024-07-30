import { ExtractJwt, Strategy as JwtPassportStrategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable } from '@nestjs/common';
import { UserService } from '../../user/user.service';
import { User } from '@rwa/shared';

@Injectable()
export class JwtStrategy extends PassportStrategy(JwtPassportStrategy) {
  constructor(private userService: UserService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: process.env.JWT_SECRET,
    });
  }

  async validate(payload: any) {
    return payload.user;
    try {
      if (payload.sub == undefined) {
        return {
          roles: payload.roles,
        } as User;
      }
      return await this.userService.getUserById(payload.sub);
    } catch (err) {
      throw err;
    }
  }
}
