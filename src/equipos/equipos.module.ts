import { Module } from '@nestjs/common';
import { EquiposService } from './equipos.service';
import { EquiposController } from './equipos.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Equipo } from './entities/equipo.entity';
import { CategoriasModule } from 'src/categorias/categorias.module';
import { DirigentesModule } from 'src/dirigentes/dirigentes.module';
import { CategoriasService } from 'src/categorias/categorias.service';
import { DirigentesService } from 'src/dirigentes/dirigentes.service';
import { Dirigente } from 'src/dirigentes/entities/dirigente.entity';
import { Categoria } from 'src/categorias/entities/categoria.entity';
import { Partido } from 'src/partidos/entities/partido.entity';
import { Posicione } from 'src/posiciones/entities/posicione.entity';
import { Campeonato } from 'src/campeonatos/entities/campeonato.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Equipo, Dirigente, Categoria, Campeonato, Posicione])],
  controllers: [EquiposController],
  providers: [EquiposService],
})
export class EquiposModule {}
