import { Body, Controller, Get, Post } from '@nestjs/common';
import { AuthService } from './auth.service';
import { RegistrarDto } from './dto/registrar.dto';
import { LoginDto } from './dto/login.dto';
import { UserActiveInterface } from 'src/common/interfaces/user-active.interface';
import { ActiveUser } from 'src/common/decorators/active-user.decorator';
import { Auth } from './decorators/auth.decorator';
import { Rol } from 'src/common/enums/rol.enum';


interface RequestWithUser extends Request {
    usuario: {
        username: string,
        rol: string

    }
}

@Controller('auth')
export class AuthController {

    constructor(private readonly authService: AuthService) { }

    @Post('registrar')
    registrar(
        @Body()
        registrarDto: RegistrarDto
    ) {
        return this.authService.registrar(registrarDto);
    }

    @Post('login')
    login(
        @Body()
        loginDto: LoginDto,
    ) {
        return this.authService.login(loginDto);
    }

    @Get('perfil')
    @Auth(Rol.USER)
    perfil(@ActiveUser() user: UserActiveInterface) {
        console.log(user)
        return this.authService.perfil(user);
    }

}
