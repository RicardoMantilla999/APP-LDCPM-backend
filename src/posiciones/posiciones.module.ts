import { forwardRef, Module } from '@nestjs/common';
import { PosicionesService } from './posiciones.service';
import { PosicionesController } from './posiciones.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Posicione } from './entities/posicione.entity';
import { Equipo } from 'src/equipos/entities/equipo.entity';
import { Categoria } from 'src/categorias/entities/categoria.entity';
import { Fase } from 'src/fases/entities/fase.entity';
import { Partido } from 'src/partidos/entities/partido.entity';
import { PartidosModule } from 'src/partidos/partidos.module';

@Module({
  imports: [TypeOrmModule.forFeature([Posicione, Equipo, Categoria, Fase, Partido]), forwardRef(() => PartidosModule), PosicionesModule],
  exports: [PosicionesService],
  controllers: [PosicionesController],
  providers: [PosicionesService],
})
export class PosicionesModule {}
