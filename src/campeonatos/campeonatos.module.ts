import { Module } from '@nestjs/common';
import { CampeonatosService } from './campeonatos.service';
import { CampeonatosController } from './campeonatos.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Campeonato } from './entities/campeonato.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Campeonato])],
  controllers: [CampeonatosController],
  providers: [CampeonatosService],
})
export class CampeonatosModule {}
