import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { JwtPayloadInterface } from '../interface/jwtPayload.interface'; // Define this interface based on your token payload

export const GetUser = createParamDecorator(
  (data: keyof JwtPayloadInterface | undefined, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest();
    const user: JwtPayloadInterface = request.user;

    return data ? user?.[data] : user;
  },
);
