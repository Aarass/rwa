import { Reflector } from '@nestjs/core';
import { Role } from '@rwa/shared';

export const Roles = Reflector.createDecorator<Role[]>();
