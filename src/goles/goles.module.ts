import { Module } from '@nestjs/common';
import { GolesService } from './goles.service';
import { GolesController } from './goles.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Jugador } from 'src/jugadores/entities/jugador.entity';
import { Gole } from './entities/gole.entity';
import { Partido } from 'src/partidos/entities/partido.entity';
import { Equipo } from 'src/equipos/entities/equipo.entity';
import { Fase } from 'src/fases/entities/fase.entity';
import { Campeonato } from 'src/campeonatos/entities/campeonato.entity';
import { Categoria } from 'src/categorias/entities/categoria.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Gole, Jugador, Partido, Equipo, Fase, Campeonato, Categoria])],
  controllers: [GolesController],
  providers: [GolesService],
})
export class GolesModule {}
