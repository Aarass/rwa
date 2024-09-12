import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { AccessTokenPayload } from '@rwa/shared';
import { ExtractJwt, Strategy as JwtPassportStrategy } from 'passport-jwt';

@Injectable()
export class JwtStrategy extends PassportStrategy(JwtPassportStrategy) {
  constructor() {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: process.env.JWT_SECRET,
    });
  }

  async validate(payload: AccessTokenPayload) {
    return payload.user;
  }
}
