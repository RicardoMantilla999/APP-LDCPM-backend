import { Module } from '@nestjs/common';
import { SorteosService } from './sorteos.service';
import { SorteosController } from './sorteos.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Sorteo } from './entities/sorteo.entity';
import { Categoria } from 'src/categorias/entities/categoria.entity';
import { Equipo } from 'src/equipos/entities/equipo.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Sorteo, Categoria, Equipo])],
  controllers: [SorteosController],
  providers: [SorteosService],
})
export class SorteosModule {}
