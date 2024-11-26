import { Module } from '@nestjs/common';
import { GruposService } from './grupos.service';
import { GruposController } from './grupos.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Grupo } from './entities/grupo.entity';
import { Fase } from 'src/fases/entities/fase.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Grupo,Fase])],
  controllers: [GruposController],
  providers: [GruposService],
})
export class GruposModule {}
