import { Module } from '@nestjs/common';
import { JugadoresService } from './jugadores.service';
import { JugadoresController } from './jugadores.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Jugador } from './entities/jugador.entity';
import { Equipo } from 'src/equipos/entities/equipo.entity';
import { Gole } from 'src/goles/entities/gole.entity';
import { Tarjeta } from 'src/tarjetas/entities/tarjeta.entity';
import { Campeonato } from 'src/campeonatos/entities/campeonato.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Jugador,Equipo, Gole, Tarjeta,Campeonato])],
  controllers: [JugadoresController],
  providers: [JugadoresService],
})
export class JugadoresModule {}
