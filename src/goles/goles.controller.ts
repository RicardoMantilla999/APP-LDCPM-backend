import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { GolesService } from './goles.service';
import { CreateGoleDto } from './dto/create-gole.dto';
import { UpdateGoleDto } from './dto/update-gole.dto';

@Controller('goles')
export class GolesController {
  constructor(private readonly golesService: GolesService) { }

  @Post()
  create(@Body() createGoleDto: CreateGoleDto) {
    return this.golesService.create(createGoleDto);
  }

  @Get()
  findAll() {
    return this.golesService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.golesService.findOne(+id);
  }

  @Get('goleadores/:id/:cantidad')
  findGoleadores(@Param('id') id: string, @Param('cantidad') cantidad: string) {
    return this.golesService.getGoleadoresByCategoria(+id, +cantidad);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateGoleDto: UpdateGoleDto) {
    return this.golesService.update(+id, updateGoleDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.golesService.remove(+id);
  }

  @Post('guardar')
  async guardarGoles(@Body() datos: { jugadorId: number; goles: number; partidoId: number; equipoId: number }) {
    return this.golesService.guardarGoles(datos.jugadorId, datos.goles, datos.partidoId, datos.equipoId);
  }





}
