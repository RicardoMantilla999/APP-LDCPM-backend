import { applyDecorators, UseGuards } from "@nestjs/common";
import { Rol } from "src/common/enums/rol.enum";
import { AuthGuard } from "src/auth/guard/auth.guard";
import { RolesGuard } from "src/auth/guard/roles.guard";
import { Roles } from "src/auth/decorators/roles.decorator";


export function Auth(rol: Rol){
    return applyDecorators(
        Roles(rol),
        UseGuards(AuthGuard, RolesGuard)
    )
}