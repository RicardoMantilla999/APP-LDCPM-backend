import { Module } from '@nestjs/common';
import { FasesService } from './fases.service';
import { FasesController } from './fases.controller';

@Module({
  controllers: [FasesController],
  providers: [FasesService],
})
export class FasesModule {}
