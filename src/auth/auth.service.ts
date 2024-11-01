import { BadRequestException, Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UsuariosService } from 'src/usuarios/usuarios.service';
import { RegistrarDto } from './dto/registrar.dto';
import { LoginDto } from './dto/login.dto';
import * as bcryptjs from 'bcryptjs';

@Injectable()
export class AuthService {

    constructor(
        private readonly usuariosService: UsuariosService,
        private readonly jwtService: JwtService
    ) { }

    async registrar({ username, password, rol}: RegistrarDto) {
        const usuario = await this.usuariosService.findOneByUsername(username);

        if (usuario) {
            throw new BadRequestException('Usuario ya existe');
        }
        await this.usuariosService.create({
            username,
            password: await bcryptjs.hash(password, 10),
        });
        return {
            username,
            rol,
        };
    }

    async login({ username, password }: LoginDto) {
        const usuario = await this.usuariosService.findByUsernameWithPassword(username);
        if (!usuario) {
            throw new UnauthorizedException('Usuario '+username+' No Existe');
        }

        const isPasswordValid = await bcryptjs.compare(password, usuario.password);
        if (!isPasswordValid) {
            throw new UnauthorizedException('Contraseña Incorrecta');
        }

        const payload = { username: usuario.username, rol: usuario.rol };

        const token = await this.jwtService.signAsync(payload)

        return {
            token,
            username
        };
    }

    async perfil({ username, rol }: { username: string; rol: string }) {
        return await this.usuariosService.findOneByUsername(username);
    }

}
