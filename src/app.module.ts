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
import { SupabaseService } from './common/cloudinary/cloudinary.service';
import { MulterModule } from '@nestjs/platform-express';

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: process.env.NODE_ENV === 'production' ? '.env.prod' : '.env.dev',
      isGlobal: true,
    }),
    TypeOrmModule.forRootAsync({
      useFactory: () => {
        if (process.env.NODE_ENV === 'production') {
          // Solo en producción, utilizamos la URL completa
          return {
            type: 'postgres',
            url: process.env.DATABASE_URL, // Usamos la URL de conexión para producción
            autoLoadEntities: true,
            synchronize: false, // En producción no usar synchronize
          };
        }
        // En desarrollo, usamos los parámetros individuales
        return {
          type: 'postgres',
          host: process.env.DATABASE_HOST,
          port: parseInt(process.env.DATABASE_PORT, 10),
          username: process.env.DATABASE_USER,
          password: process.env.DATABASE_PASSWORD,
          database: process.env.DATABASE_NAME,
          autoLoadEntities: true,
          synchronize: true, // Solo en desarrollo usamos synchronize
        };
      },
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
    CloudinaryModule,
    MulterModule.register({
      limits: { fileSize: 5 * 1024 * 1024 }, // Límite de 5MB por archivo
    }),
  ],
  controllers: [AppController],
  providers: [AppService, SupabaseService],
})
export class AppModule{}