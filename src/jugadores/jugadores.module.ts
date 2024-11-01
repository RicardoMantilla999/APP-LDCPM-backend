import { Module } from '@nestjs/common';
import { JugadoresService } from './jugadores.service';
import { JugadoresController } from './jugadores.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Jugador } from './entities/jugador.entity';
import { Equipo } from 'src/equipos/entities/equipo.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Jugador,Equipo])],
  controllers: [JugadoresController],
  providers: [JugadoresService],
})
export class JugadoresModule {}
