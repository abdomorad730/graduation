
import { Injectable, CanActivate, ExecutionContext, UnauthorizedException } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { userRoles } from '../types/types';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const requiredRoles = this.reflector.get<userRoles[]>('roles', context.getHandler()    );
    if (!requiredRoles.length) {
        throw new UnauthorizedException('roles must be specified')
    }
    const { user } = context.switchToHttp().getRequest();
    if(!requiredRoles.includes(user.role)){
        throw new UnauthorizedException('Unauthorized')
    }
    return true
  }
}
