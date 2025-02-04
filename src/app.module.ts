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
import { ServeStaticModule } from '@nestjs/serve-static';
import { join } from 'path';
import { ConfigModule, ConfigService } from '@nestjs/config';

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: process.env.NODE_ENV === 'production' ? '.env.production' : '.env',
      isGlobal: true,
    }),
    //Desarrollo
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => {
        const isProduction = process.env.NODE_ENV === 'production';
        return {
          type: 'postgres',
          url: isProduction ? configService.get<string>('DATABASE_URL') : undefined,
          host: isProduction ? undefined : configService.get<string>('DATABASE_HOST'),
          port: isProduction ? undefined : parseInt(configService.get<string>('DATABASE_PORT') || '5432'),
          username: isProduction ? undefined : configService.get<string>('DATABASE_USER'),
          password: isProduction ? undefined : String(configService.get<string>('DATABASE_PASSWORD') || ''),
          database: isProduction ? undefined : configService.get<string>('DATABASE_NAME'),
          autoLoadEntities: true,
          synchronize: !isProduction, // Solo en desarrollo
        };
      },
    }),
    //Producción
    /*
    TypeOrmModule.forRoot({
      type: "postgres",
      host: "localhost",
      port: 5431,
      username: "ldcpm",
      password: "1234",
      database: "LDCPM",
      autoLoadEntities: true,
      synchronize: true,
    }),
    */
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
    ServeStaticModule.forRoot({
      rootPath: join(__dirname, '..', 'media'),
      serveRoot: '/media',
    }),
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply((req, res, next) => {
        res.header('Access-Control-Allow-Origin', process.env.ALLOWED_ORIGIN || 'http://localhost:4200');
        res.header('Access-Control-Allow-Methods', 'GET,HEAD,PUT,PATCH,POST,DELETE');
        res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization');

        if (req.method === 'OPTIONS') {
          return res.sendStatus(204);
        }

        next();
      })
      .forRoutes('*');
  }
}