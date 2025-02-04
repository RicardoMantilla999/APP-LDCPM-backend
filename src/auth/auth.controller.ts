import { Body, Controller, Get, Post, Query, Request, UnauthorizedException, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import { RegistrarDto } from './dto/registrar.dto';
import { LoginDto } from './dto/login.dto';
import { AuthGuard } from '@nestjs/passport';

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
    async login(@Body() loginDto: LoginDto) {
      const { email, password } = loginDto;
      return this.authService.login(email, password); // Se pasan los valores de email y password
    }

    // @Get('perfil')
    // @Auth(Rol.USER)
    // perfil(@ActiveUser() user: UserActiveInterface) {
    //     console.log(user)
    //     return this.authService.perfil(user);
    // }

    @Get('campeonatos')
    getDashboard(@Request() req) {
      const user = req.user;  // Aquí obtienes el usuario del token
      const userRole = user.role;  // Accede al rol del usuario
  
      // Verifica si el usuario tiene el rol adecuado
      if (userRole !== 'ADMIN') {
        throw new UnauthorizedException('You do not have permission to access this resource');
      }
  
      return { message: 'Welcome to the admin dashboard' };
    }

}
