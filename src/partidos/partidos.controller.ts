import { Controller, Get, Post, Body, Patch, Param, Delete, ParseIntPipe, HttpCode, Query } from '@nestjs/common';
import { PartidosService } from './partidos.service';
import { CreatePartidoDto } from './dto/create-partido.dto';
import { UpdatePartidoDto } from './dto/update-partido.dto';
import { Gole } from 'src/goles/entities/gole.entity';
import { Partido } from './entities/partido.entity';
import { Equipo } from 'src/equipos/entities/equipo.entity';

@Controller('partidos')
export class PartidosController {
  constructor(private readonly partidosService: PartidosService) { }

  @Post()
  create(@Body() createPartidoDto: CreatePartidoDto) {
    return this.partidosService.create(createPartidoDto);
  }

  @Get('fase:fase/categoria:cat/fecha:fecha')
  findAll(@Param('fase') fase: number, @Param('cat') cat: number, @Param('fecha') fecha: number) {
    return this.partidosService.findAll(fase, cat, fecha);
  }

  @Get('fase:fase/categoria:cat')
  getPartidosCompletos(@Param('fase') fase: number, @Param('cat') cat: number) {
    return this.partidosService.getPartidosAgrupadosPorFecha(fase, cat);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.partidosService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updatePartidoDto: UpdatePartidoDto) {
    return this.partidosService.update(+id, updatePartidoDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.partidosService.remove(+id);
  }

  @Get('fechas/:categoriaId/:faseId')
  async obtenerFechas(@Param('categoriaId') categoriaId: number, @Param('faseId') faseId: number): Promise<number[]> {
    return this.partidosService.obtenerFechas(categoriaId, faseId);
  }

  @Patch(':id/actualizar-resultado')
  @HttpCode(204)  // Código 204 para indicar que no se devuelve contenido
  async actualizarResultado(@Param('id') id: number): Promise<void> {
    await this.partidosService.actualizarResultadoPartido(id);
  }




  @Patch(':id/actualizar')
  async actualizarPartido(
    @Param('id', ParseIntPipe) id: number,
    @Body() cambios: Partial<Partido>,
  ): Promise<Partido> {
    return this.partidosService.actualizarPartido(id, cambios);
  }

  //@Get(':id')
  //findOne(@Param('id') id: string) {
  //return this.partidosService.findOne(+id);
  // }


  @Get('Cuartos/:categoria')
  async obtenerPartidosFaseCuartos(
    @Param('categoria') categoria: number): Promise<Partido[]> {

    return this.partidosService.obtenerPartidosFaseCuartos(+categoria);
  }

  @Get('Semifinal/:categoria')
  async obtenerPartidosFaseSemifinal(
    @Param('categoria') categoria: number): Promise<Partido[]> {

    return this.partidosService.obtenerPartidosFaseSemifinal(+categoria);
  }

  @Get('Final/:categoria')
  async obtenerPartidosFaseFinal(
    @Param('categoria') categoria: number): Promise<Partido[]> {

    return this.partidosService.obtenerPartidosFaseFinal(+categoria);
  }


  @Get('Campeon/:categoria')
  async obtenerCampeon(
    @Param('categoria') categoria: number): Promise<Equipo> {

    return this.partidosService.obtenerCampeon(+categoria);
  }

}
