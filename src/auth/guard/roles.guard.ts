import { CanActivate, ExecutionContext, ForbiddenException, Injectable, UnauthorizedException } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { ROLES_KEY } from 'src/auth/decorators/roles.decorator';
import { Rol } from 'src/common/enums/rol.enum';

@Injectable()
export class RolesGuard implements CanActivate {

  constructor(private readonly reflector: Reflector){}

  canActivate(context: ExecutionContext): boolean {
    // Obtener los roles requeridos para la ruta
    const requiredRoles = this.reflector.getAllAndOverride<Rol[]>(ROLES_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);

    // Si no se especifican roles, permitir acceso
    if (!requiredRoles) {
      return true;
    }

    // Obtener el usuario del contexto
    const { user } = context.switchToHttp().getRequest();

    // Validar si el usuario está autenticado
    if (!user) {
      throw new UnauthorizedException('Usuario no autenticado.');
    }

    // Validar si el usuario tiene al menos uno de los roles requeridos
    const hasRole = requiredRoles.some((rol) => user.rol === rol);

    if (!hasRole) {
      throw new ForbiddenException('Acceso denegado.');
    }

    return true; // Permitir el acceso si cumple con los roles
  }
}
 