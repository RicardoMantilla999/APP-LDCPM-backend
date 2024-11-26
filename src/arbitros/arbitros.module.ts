import { Module } from '@nestjs/common';
import { ArbitrosService } from './arbitros.service';
import { ArbitrosController } from './arbitros.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Arbitro } from './entities/arbitro.entity';
import { Campeonato } from 'src/campeonatos/entities/campeonato.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Arbitro, Campeonato])],
  controllers: [ArbitrosController],
  providers: [ArbitrosService],
})
export class ArbitrosModule {}
