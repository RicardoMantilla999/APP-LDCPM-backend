import { Controller, Get, Post, Body, Patch, Param, Delete, Query } from '@nestjs/common';
import { TarjetasService } from './tarjetas.service';
import { CreateTarjetaDto } from './dto/create-tarjeta.dto';
import { UpdateTarjetaDto } from './dto/update-tarjeta.dto';
import { TipoTarjeta } from 'src/common/enums/tarjetas.enum';
import { Resultado } from '../tarjetas/tarjetas.interface';


@Controller('tarjetas')
export class TarjetasController {
  constructor(private readonly tarjetasService: TarjetasService) {}

  @Post()
  create(@Body() createTarjetaDto: CreateTarjetaDto) {
    return this.tarjetasService.create(createTarjetaDto);
  }

  @Get()
  findAll() {
    return this.tarjetasService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.tarjetasService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateTarjetaDto: UpdateTarjetaDto) {
    return this.tarjetasService.update(+id, updateTarjetaDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.tarjetasService.remove(+id);
  }


  @Post('guardar')
async guardarTarjeta(@Body() datos: { jugadorId: number; partidoId: number; equipoId: number; tipo: TipoTarjeta }) {
  return this.tarjetasService.guardarTarjeta(datos.jugadorId, datos.partidoId, datos.equipoId, datos.tipo);
}

  @Get(':partidoId')
async obtenerTarjetasPorPartido(@Param('partidoId') partidoId: number) {
  return await this.tarjetasService.obtenerTarjetasPorPartido(partidoId);
}

@Get('/reporte/:categoriaId/:equipoId/:faseId')
  async getReporteTarjetas(
    @Param('categoriaId') categoriaId: number,
    @Param('equipoId') equipoId: number,
    @Param('faseId') faseId: number,
  ) {
    return this.tarjetasService.getTarjetasPorFechas(categoriaId, equipoId, faseId);
  }

}
