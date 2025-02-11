import { applyDecorators, UseGuards } from "@nestjs/common";
import { Rol } from "../../common/enums/rol.enum";
import { AuthGuard } from "../../auth/guard/auth.guard";
import { RolesGuard } from "../../auth/guard/roles.guard";
import { Roles } from "../../auth/decorators/roles.decorator";


export function Auth(rol: Rol){
    return applyDecorators(
        Roles(rol),
        UseGuards(AuthGuard, RolesGuard)
    )
}