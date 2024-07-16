import { META_NAME } from '@Constant/constants';
import { CanActivate, ExecutionContext, Injectable, SetMetadata } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { JwtService } from '@nestjs/jwt';
@Injectable()
export class PrivilegeGuard implements CanActivate {
  constructor(private reflector: Reflector, private readonly jwtService: JwtService) {}
  canActivate(context: ExecutionContext): boolean {
    const requiredRoles = this.reflector.getAllAndOverride<string[]>(META_NAME.Privilege, [
      context.getHandler(),
      context.getClass(),
    ]);

    const request = context.switchToHttp().getRequest();
    const token = request.headers.authorization?.replace('Bearer ', '') || '';
    const permission = this.jwtService.decode(token);

    if (!requiredRoles) {
      return true;
    }
    // const user = context.getArgs()[0].user;

    return requiredRoles.some((role) => permission['permission']?.includes(role));
  }
}
export const Privilege = (...role: string[]) => SetMetadata(META_NAME.Privilege, role);
