
import { applyDecorators, SetMetadata, UseGuards } from '@nestjs/common';
import { AuthGuard } from '../guard/userGuard';
import { RolesGuard } from '../guard/authorization';
import { userRoles } from '../types/types';

export function Auth(...roles: userRoles[]) {
  return applyDecorators(
    SetMetadata('roles', roles),
    UseGuards(AuthGuard, RolesGuard),

  );
}
