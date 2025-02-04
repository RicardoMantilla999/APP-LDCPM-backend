import { BadRequestException, Injectable, InternalServerErrorException, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UsuariosService } from 'src/usuarios/usuarios.service';
import { RegistrarDto } from './dto/registrar.dto';
import { LoginDto } from './dto/login.dto';
import * as bcryptjs from 'bcryptjs';
import { Rol } from 'src/common/enums/rol.enum';
import { rootCertificates } from 'tls';

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
        console.log('Email:', email); // Agregar log para verificar
        console.log('Password:', password); // Agregar log para verificar
        if (!password) {
            throw new BadRequestException('La contraseña no puede estar vacía');
        }

        const usuario = await this.usuariosService.findByEmailWithPassword(email);
        console.log('Usuario:', usuario); // Agregar log para verificar
        if (!usuario) {
            throw new UnauthorizedException('Credenciales inválidas');
        }

        console.log('Contraseña', password);
        console.log('Contraseña hasheada', usuario.password);
        const isMatch = await bcryptjs.compare(password, usuario.password);
        if (!isMatch) {
            throw new UnauthorizedException('Credenciales inválidas');
        }

        // Si la contraseña es correcta, generar el JWT
        const payload = { sub: usuario.id, username: usuario.username, email: usuario.email, rol: usuario.rol };
        const token = await this.jwtService.signAsync(payload);

        return { access_token: token, rol: usuario.rol };
    }

    

}
