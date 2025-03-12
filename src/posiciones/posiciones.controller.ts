import { Controller, Get, Post, Body, Patch, Param, Delete, Query, Res, HttpStatus, InternalServerErrorException, ParseIntPipe } from '@nestjs/common';
import { PosicionesService } from './posiciones.service';
import { CreatePosicioneDto } from './dto/create-posicione.dto';
import { UpdatePosicioneDto } from './dto/update-posicione.dto';
import { PartidosService } from 'src/partidos/partidos.service';

@Controller('posiciones')
export class PosicionesController {
  constructor(private readonly posicionesService: PosicionesService,
    private readonly partidoService: PartidosService
  ) { }

  @Post()
  create(@Body() createPosicioneDto: CreatePosicioneDto) {
    return this.posicionesService.create(createPosicioneDto);
  }

  @Get()
  findAll() {
    return this.posicionesService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.posicionesService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updatePosicioneDto: UpdatePosicioneDto) {
    return this.posicionesService.update(+id, updatePosicioneDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.posicionesService.remove(+id);
  }




  // Endpoint para obtener posiciones filtradas por categoría y fase
  @Get('listar')
  async obtenerPosiciones(
    @Query('categoriaId') categoriaId: number,
    @Query('faseId') faseId: number,
    @Res() res,
  ): Promise<any> {
    try {
      const posiciones = await this.posicionesService.obtenerPosiciones(categoriaId, faseId);
      return res.status(HttpStatus.OK).json({
        message: 'Posiciones obtenidas correctamente.',
        posiciones,
      });
    } catch (error) {
      console.error('Error al obtener posiciones:', error);
      return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
        message: 'Ocurrió un error al obtener las posiciones.',
        error: error.message,
      });
    }
  }

  @Patch(':id/posiciones')
  async actualizarPosiciones(@Param('id') id: number): Promise<void> {
    return this.posicionesService.actualizarTablaPosiciones(id);
  }

  @Get(':categoriaId/:faseId')
  async obtenerTablaPosiciones(
    @Param('categoriaId') categoriaId: number,
    @Param('faseId') faseId: number,
  ) {
    return this.posicionesService.obtenerPosiciones(categoriaId, faseId);
  }

  @Get(':categoria/:fase/posicionesA')
  async obtenerPosicionesA(
    @Param('categoria') categoria: number,
    @Param('fase') fase: number,
  ) {
    return this.posicionesService.tablaPosicionesGrupoA(categoria, fase);
  }

  @Get(':categoria/:fase/posicionesB')
  async obtenerPosicionesB(
    @Param('categoria') categoria: number,
    @Param('fase') fase: number,
  ) {
    return this.posicionesService.tablaPosicionesGrupoB(categoria, fase);
  }

}
