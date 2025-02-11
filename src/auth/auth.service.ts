import { BadRequestException, Injectable, InternalServerErrorException, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UsuariosService } from 'src/usuarios/usuarios.service';
import { RegistrarDto } from './dto/registrar.dto';
import * as bcryptjs from 'bcryptjs';
import { Rol } from 'src/common/enums/rol.enum';

@Injectable()
export class AuthService {

    constructor(
        private readonly usuariosService: UsuariosService,
        private readonly jwtService: JwtService,
    ) { }

    async registrar({ username, email, password, rol }: RegistrarDto) {
        // Verificar si el username o email ya existe
        const usuarioExistente = await this.usuariosService.findOneByUsernameOrEmail(username, email);
        if (usuarioExistente) {
            throw new BadRequestException('El username o el email ya están registrados.');
        }

        // Hashear la contraseña
        const hashedPassword = await bcryptjs.hash(password, 10);

        // Crear el usuario
        const nuevoUsuario = await this.usuariosService.create({
            username,
            email,
            password: hashedPassword,
            rol: rol || Rol.USER, // Valor predeterminado si no se especifica
        });

        return {
            message: 'Usuario registrado exitosamente.',
            username: nuevoUsuario.username,
            email: nuevoUsuario.email,
        };
    }

    //async perfil({ email, rol }: { username: string; rol: string }) {
    //  return await this.usuariosService.findOneByEmail(email);
    // }


    async login(email: string, password: string) {
        if (!password) {
            throw new BadRequestException('La contraseña no puede estar vacía');
        }

        const usuario = await this.usuariosService.findByEmailWithPassword(email);
        if (!usuario) {
            throw new UnauthorizedException('Credenciales inválidas');
        }

        const isMatch = await bcryptjs.compare(password, usuario.password);
        if (!isMatch) {
            throw new UnauthorizedException('Credenciales inválidas');
        }

        // Generar el payload
        const payload = { sub: usuario.id, username: usuario.username, email: usuario.email, rol: usuario.rol };

        // Generar Access Token (expira en 15 min)
        const access_token = await this.jwtService.signAsync(payload, { expiresIn: '20m' });

        // Generar Refresh Token (expira en 7 días)
        const refresh_token = await this.jwtService.signAsync(payload, { expiresIn: '30m' });

        return { access_token, refresh_token, rol: usuario.rol };
    }

    async refreshToken(refreshToken: string) {
        try {
            // Verificar si el refresh_token es válido
            const decoded = this.jwtService.verify(refreshToken);
            const payload = { sub: decoded.sub, username: decoded.username, email: decoded.email, rol: decoded.rol };

            // Generar un nuevo access_token (5 min)
            const newAccessToken = await this.jwtService.signAsync(payload, { expiresIn: '20m' });

            // Generar un nuevo refresh_token (10 min)
            const newRefreshToken = await this.jwtService.signAsync(payload, { expiresIn: '30m' });

            return { access_token: newAccessToken, refresh_token: newRefreshToken };
        } catch (error) {
            throw new UnauthorizedException('Refresh token inválido o expirado');
        }
    }




}
