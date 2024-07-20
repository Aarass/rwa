import {
  Injectable,
  CanActivate,
  ExecutionContext,
  InternalServerErrorException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Roles } from '../decorators/roles.decorator';
import { Role } from '@rwa/shared';
import { use } from 'passport';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const requiredRoles = this.reflector.get(Roles, context.getHandler());
    if (!requiredRoles) {
      return true;
    }

    const user = context.switchToHttp().getRequest().user;
    const userRoles = user.roles as Role[];
    if (!userRoles) {
      throw new InternalServerErrorException();
    }

    console.log(user);
    console.log(requiredRoles, userRoles);

    const res = requiredRoles.every((role) => userRoles.includes(role));
    console.log(res);
    return res;
  }
}
