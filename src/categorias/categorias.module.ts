import { Module } from '@nestjs/common';
import { CategoriasService } from './categorias.service';
import { CategoriasController } from './categorias.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Categoria } from './entities/categoria.entity';
import { Campeonato } from 'src/campeonatos/entities/campeonato.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Categoria, Campeonato])],
  controllers: [CategoriasController],
  providers: [CategoriasService],
  exports: [CategoriasService, TypeOrmModule]
})
export class CategoriasModule {}
