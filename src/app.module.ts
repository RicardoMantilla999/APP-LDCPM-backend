import { Module } from '@nestjs/common';
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
import { SorteosModule } from './sorteos/sorteos.module';

@Module({
  imports: [
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
    SorteosModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
