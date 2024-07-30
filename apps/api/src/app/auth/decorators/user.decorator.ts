import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { User } from '@rwa/shared';

export const ExtractUser = createParamDecorator(
  (_: unknown, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest();
    return request.user as User;
  }
);
