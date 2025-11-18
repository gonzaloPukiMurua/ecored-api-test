/* eslint-disable prettier/prettier */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import {
  CanActivate,
  ExecutionContext,
  Inject,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { AUTH_TYPE_KEY } from '../constants/auth.constants';
import { AccessTokenGuard } from './access-token.guard';
import { AuthType } from '../enums/auth-type.enum';
import { Reflector } from '@nestjs/core';
import { OptionalAuthGuard } from './optional-auth.guard';

@Injectable()
export class AuthenticationGuard implements CanActivate {
  private readonly authTypeGuardMap: Record<AuthType, CanActivate | CanActivate[]>;

  constructor(
    private readonly reflector: Reflector,
    @Inject(AccessTokenGuard)
    private readonly accessTokenGuard: AccessTokenGuard,
    @Inject(OptionalAuthGuard)
    private readonly optionalAuthGuard: OptionalAuthGuard
  ) {
    // ✅ ahora sí podés usar this.accessTokenGuard
    this.authTypeGuardMap = {
      [AuthType.Bearer]: this.accessTokenGuard,
      [AuthType.Optional]: this.optionalAuthGuard,
      [AuthType.None]: { canActivate: () => true },
    };
  }

  private static readonly defaultAuthType = AuthType.Bearer;

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const authTypes =
      this.reflector.getAllAndOverride<AuthType[]>(
        AUTH_TYPE_KEY,
        [context.getHandler(), context.getClass()],
      ) ?? [AuthenticationGuard.defaultAuthType];

    console.log('AuthTypes detected:', authTypes);

    const guards = authTypes.map((type) => this.authTypeGuardMap[type]).flat();

    let error = new UnauthorizedException();

    for (const instance of guards) {
      const canActivate = await Promise.resolve(
        instance.canActivate(context),
      ).catch((err) => {
        error = err;
      });
      if (canActivate) {
        return true;
      }
    }
    throw error;
  }
}
