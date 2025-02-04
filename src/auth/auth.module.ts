import { forwardRef, Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { UsuariosModule } from 'src/usuarios/usuarios.module';
import { JwtModule } from '@nestjs/jwt';
import { jwtConstants } from 'src/constants/jwt.constants';
import { PassportModule } from '@nestjs/passport';
import { JwtStrategy } from './strategies/jwt.strategy';
import { RolesGuard } from './guard/roles.guard';
import { AuthGuard } from './guard/auth.guard';

@Module({
  imports: [forwardRef(() => UsuariosModule),
    PassportModule.register({ defaultStrategy: 'jwt' }),
    
    JwtModule.register({
      global: true,
      secret: jwtConstants.secret,
      signOptions: { expiresIn: '20m' },
    }),
  ],
  controllers: [AuthController],
  providers: [AuthService, JwtStrategy, AuthGuard, RolesGuard],
  exports: [JwtModule, AuthService],
})
export class AuthModule {}
