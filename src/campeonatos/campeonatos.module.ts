import { Module } from '@nestjs/common';
import { CampeonatosService } from './campeonatos.service';
import { CampeonatosController } from './campeonatos.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Campeonato } from './entities/campeonato.entity';
import { Fase } from 'src/fases/entities/fase.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Campeonato, Fase])],
  controllers: [CampeonatosController],
  providers: [CampeonatosService],
})
export class CampeonatosModule {}
