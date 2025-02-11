import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { TypeOrmModule } from "@nestjs/typeorm";
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsuariosModule } from './usuarios/usuarios.module';
import { AuthModule } from './auth/auth.module';
import { EquiposModule } from './equipos/equipos.module';
import { CategoriasModule } from './categorias/categorias.module';
import { DirigentesModule } from './dirigentes/dirigentes.module';
import { ArbitrosModule } from './arbitros/arbitros.module';
import { JugadoresModule } from './jugadores/jugadores.module';
import { CampeonatosModule } from './campeonatos/campeonatos.module';
import { FasesModule } from './fases/fases.module';
import { GruposModule } from './grupos/grupos.module';
import { PartidosModule } from './partidos/partidos.module';
import { GolesModule } from './goles/goles.module';
import { TarjetasModule } from './tarjetas/tarjetas.module';
import { PosicionesModule } from './posiciones/posiciones.module';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { CloudinaryModule } from './common/cloudinary/cloudinary.module';
import { CloudinaryService } from './common/cloudinary/cloudinary.service';
import { MulterModule } from '@nestjs/platform-express';

@Module({
  imports: [
    CloudinaryModule,
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: process.env.DATABASE_HOST,
      port: parseInt(process.env.DATABASE_PORT),
      username: process.env.DATABASE_USER,
      password: process.env.DATABASE_PASSWORD,
      database: process.env.DATABASE_NAME,
      autoLoadEntities: true,
      synchronize: true, // Solo en desarrollo usamos synchronize

    }),
    UsuariosModule,
    AuthModule,
    EquiposModule,
    CategoriasModule,
    DirigentesModule,
    ArbitrosModule,
    JugadoresModule,
    CampeonatosModule,
    FasesModule,
    GruposModule,
    PartidosModule,
    GolesModule,
    TarjetasModule,
    PosicionesModule,
    MulterModule.register({
      limits: { fileSize: 5 * 1024 * 1024 }, // Límite de 5MB por archivo
    }),
  ],
  controllers: [AppController],
  providers: [AppService, CloudinaryService],
})
export class AppModule { }