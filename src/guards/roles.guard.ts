import { META_NAME } from '@Constant/constants';
import { CanActivate, ExecutionContext, Injectable, SetMetadata } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { JwtService } from '@nestjs/jwt';
@Injectable()
export class RoleGuard implements CanActivate {
  constructor(private reflector: Reflector, private readonly jwtService: JwtService) {}
  canActivate(context: ExecutionContext): boolean {
    const requiredRoles = this.reflector.getAllAndOverride<string[]>(META_NAME.Role, [
      context.getHandler(),
      context.getClass(),
    ]);

    const request = context.switchToHttp().getRequest();
    const token = request.headers.authorization?.replace('Bearer ', '') || '';
    const user = this.jwtService.decode(token);

    if (!requiredRoles) {
      return true;
    }

    return requiredRoles.some((role) => role === user?.['role'].name);
  }
}
export const Role = (...role: string[]) => SetMetadata(META_NAME.Role, role);
