import { Module } from '@nestjs/common';
import { FasesService } from './fases.service';
import { FasesController } from './fases.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Fase } from './entities/fase.entity';
import { Campeonato } from 'src/campeonatos/entities/campeonato.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Fase, Campeonato])],
  controllers: [FasesController],
  providers: [FasesService],
})
export class FasesModule {}
