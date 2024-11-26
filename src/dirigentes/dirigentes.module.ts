import { Module } from '@nestjs/common';
import { DirigentesService } from './dirigentes.service';
import { DirigentesController } from './dirigentes.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Dirigente } from './entities/dirigente.entity';
import { Campeonato } from 'src/campeonatos/entities/campeonato.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Dirigente, Campeonato])],
  controllers: [DirigentesController],
  providers: [DirigentesService],
})
export class DirigentesModule {}
