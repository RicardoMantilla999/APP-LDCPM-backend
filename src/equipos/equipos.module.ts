import { Module } from '@nestjs/common';
import { EquiposService } from './equipos.service';
import { EquiposController } from './equipos.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Equipo } from './entities/equipo.entity';
import { Dirigente } from 'src/dirigentes/entities/dirigente.entity';
import { Categoria } from 'src/categorias/entities/categoria.entity';
import { Partido } from 'src/partidos/entities/partido.entity';
import { Posicione } from 'src/posiciones/entities/posicione.entity';
import { Campeonato } from 'src/campeonatos/entities/campeonato.entity';
import { Fase } from 'src/fases/entities/fase.entity';
import { CloudinaryModule } from 'src/common/cloudinary/cloudinary.module';

@Module({
  imports: [TypeOrmModule.forFeature([Equipo, Dirigente, Categoria, Campeonato, Posicione, Fase]), CloudinaryModule],
  controllers: [EquiposController],
  providers: [EquiposService],
})
export class EquiposModule {}
