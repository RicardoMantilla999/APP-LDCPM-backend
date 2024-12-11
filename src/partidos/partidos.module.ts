import { forwardRef, Module } from '@nestjs/common';
import { PartidosService } from './partidos.service';
import { PartidosController } from './partidos.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Partido } from './entities/partido.entity';
import { Posicione } from 'src/posiciones/entities/posicione.entity';
import { PosicionesModule } from 'src/posiciones/posiciones.module';
import { Equipo } from 'src/equipos/entities/equipo.entity';
import { Fase } from 'src/fases/entities/fase.entity';
import { Categoria } from 'src/categorias/entities/categoria.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Partido, Posicione, Equipo, Fase, Categoria]), forwardRef(() => PosicionesModule)],
  controllers: [PartidosController],
  providers: [PartidosService],
  exports: [PartidosService]
})
export class PartidosModule {}
