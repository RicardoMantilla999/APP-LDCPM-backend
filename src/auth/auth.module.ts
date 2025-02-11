import { forwardRef, Module } from '@nestjs/common';
import { AuthController } from 'src/auth/auth.controller';
import { AuthService } from 'src/auth/auth.service';
import { UsuariosModule } from 'src/usuarios/usuarios.module';
import { JwtModule } from '@nestjs/jwt';
import { jwtConstants } from 'src/constants/jwt.constants';
import { PassportModule } from '@nestjs/passport';
import { JwtStrategy } from 'src/auth/strategies/jwt.strategy';
import { RolesGuard } from '../auth/guard/roles.guard';
import { AuthGuard } from 'src/auth/guard/auth.guard';

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
