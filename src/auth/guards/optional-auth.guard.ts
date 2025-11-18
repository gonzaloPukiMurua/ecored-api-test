/* eslint-disable prettier/prettier */
import {
  CanActivate,
  ExecutionContext,
  Inject,
  Injectable,
} from '@nestjs/common';
import type { ConfigType } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import jwtConfig from '../../config/jwt.config';
import { Request } from 'express';
import { REQUEST_USER_KEY } from '../constants/auth.constants';
import { JwtPayload } from '../interfaces/jwt-payload.interface';

@Injectable()
export class OptionalAuthGuard implements CanActivate {
  constructor(
    private readonly jwtService: JwtService,
    @Inject(jwtConfig.KEY)
    private readonly jwtConfiguration: ConfigType<typeof jwtConfig>,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request: Request = context.switchToHttp().getRequest();
    const token = this.extractToken(request);

    // ✔ Si NO hay token → permitir el acceso sin usuario
    if (!token) {
      request[REQUEST_USER_KEY] = undefined;
      return true;
    }

    try {
      const payload = await this.jwtService.verifyAsync<JwtPayload>(
        token,
        this.jwtConfiguration,
      );

      // ✔ Token válido → inyectar payload
      request[REQUEST_USER_KEY] = payload;
    } catch (error) {
      // ✔ Token inválido → bloquear autenticación pero NO rechazar la request
      console.log(error)
      request[REQUEST_USER_KEY] = undefined;
    }

    return true;
  }

  private extractToken(request: Request): string | undefined {
    const [type, token] = request.headers.authorization?.split(' ') ?? [];
    if (type !== 'Bearer') return undefined;
    return token;
  }
}
