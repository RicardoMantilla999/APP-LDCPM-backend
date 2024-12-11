import { Module } from '@nestjs/common';
import { TarjetasService } from './tarjetas.service';
import { TarjetasController } from './tarjetas.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Tarjeta } from './entities/tarjeta.entity';
import { Partido } from 'src/partidos/entities/partido.entity';
import { Equipo } from 'src/equipos/entities/equipo.entity';
import { Jugador } from 'src/jugadores/entities/jugador.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Tarjeta, Partido, Equipo, Jugador])],
  controllers: [TarjetasController],
  providers: [TarjetasService],
})
export class TarjetasModule {}
