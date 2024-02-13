import { ExecutionContext, createParamDecorator } from '@nestjs/common';
import { User } from './user.entity';

export const GetUser = createParamDecorator(
  (data, ctx: ExecutionContext): User => {
    const req = ctx.switchToHttp().getRequest();
    //request 안의 user 객체만 꺼내서 반환한다.
    return req.user;
  },
);
