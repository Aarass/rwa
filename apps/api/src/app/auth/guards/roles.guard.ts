import {
  CanActivate,
  ExecutionContext,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Role } from '@rwa/shared';
import { Roles } from '../decorators/roles.decorator';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    try {
      const requiredRoles = this.reflector.get(Roles, context.getHandler());
      if (!requiredRoles) {
        return true;
      }

      const user = context.switchToHttp().getRequest().user;
      const userRoles = user.roles as Role[];
      if (!userRoles) {
        throw new InternalServerErrorException();
      }
      const res = requiredRoles.every((role) => userRoles.includes(role));
      return res;
    } catch (err) {
      console.error(err);
      throw err;
    }
  }
}
