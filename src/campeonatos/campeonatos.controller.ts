import { Controller, Get, Post, Body, Patch, Param, Delete, NotFoundException, BadRequestException, ParseIntPipe, InternalServerErrorException } from '@nestjs/common';
import { CampeonatosService } from './campeonatos.service';
import { CreateCampeonatoDto } from './dto/create-campeonato.dto';
import { UpdateCampeonatoDto } from './dto/update-campeonato.dto';
import { Partido } from 'src/partidos/entities/partido.entity';
import { Campeonato } from './entities/campeonato.entity';

@Controller('campeonatos')
export class CampeonatosController {
  constructor(private readonly campeonatosService: CampeonatosService, private readonly campeonatoService: CampeonatosService) { }

  @Post()
  create(@Body() createCampeonatoDto: CreateCampeonatoDto) {
    return this.campeonatosService.create(createCampeonatoDto);
  }

  @Get()
  findAll() {
    return this.campeonatosService.findAll();
  }

  @Post(':campeonatoId/categoria/:categoriaId/generar-calendario')
  async generarCalendario(
    @Param('campeonatoId', ParseIntPipe) campeonatoId: number,
    @Param('categoriaId', ParseIntPipe) categoriaId: number,
  ): Promise<Partido[]> {
    return this.campeonatosService.generarCalendario(campeonatoId, categoriaId);
  }


  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.campeonatosService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateCampeonatoDto: UpdateCampeonatoDto) {
    return this.campeonatosService.update(+id, updateCampeonatoDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.campeonatosService.remove(+id);
  }

  @Patch('actualizar/:id')
  async actualizarCampeonato(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateCampeonatoDto: UpdateCampeonatoDto,
  ): Promise<Campeonato> {
    return this.campeonatoService.actualizarCampeonato(id, updateCampeonatoDto);
  }

}
