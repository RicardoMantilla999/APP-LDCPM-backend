import { Module } from '@nestjs/common';
import { CampeonatosService } from './campeonatos.service';
import { CampeonatosController } from './campeonatos.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Campeonato } from './entities/campeonato.entity';
import { Fase } from 'src/fases/entities/fase.entity';
import { Partido } from 'src/partidos/entities/partido.entity';
import { Equipo } from 'src/equipos/entities/equipo.entity';
import { Categoria } from 'src/categorias/entities/categoria.entity';
import { Posicione } from 'src/posiciones/entities/posicione.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Campeonato, Fase, Partido, Equipo, Categoria, Posicione])],
  controllers: [CampeonatosController],
  providers: [CampeonatosService],
})
export class CampeonatosModule {}
