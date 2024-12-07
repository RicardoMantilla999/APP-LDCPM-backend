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

@Module({
  imports: [TypeOrmModule.forFeature([Equipo, Dirigente, Categoria, Partido]), CategoriasModule, DirigentesModule],
  controllers: [EquiposController],
  providers: [EquiposService, CategoriasService, DirigentesService],
})
export class EquiposModule {}
