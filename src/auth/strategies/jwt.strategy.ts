import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { jwtConstants } from 'src/constants/jwt.constants';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor() {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(), // Lee el token del encabezado Authorization
      ignoreExpiration: false, // Respeta la expiración del token
      secretOrKey: jwtConstants.secret
    });
  }

  async validate(payload: any) {
    console.log('Payload recibido:', payload); // Log para depurar

    if (!payload || !payload.sub || !payload.email) {
      throw new Error('Payload inválido'); // Valida el contenido del payload
    }

    // Retorna los datos necesarios para usar en el contexto de la solicitud
    return { userId: payload.sub, username: payload.username, email: payload.email, rol: payload.rol };
  }
}
