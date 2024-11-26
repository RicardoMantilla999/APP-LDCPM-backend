import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { EquiposService } from './equipos.service';
import { CreateEquipoDto } from './dto/create-equipo.dto';
import { UpdateEquipoDto } from './dto/update-equipo.dto';

@Controller('equipos')
export class EquiposController {
  constructor(private readonly equiposService: EquiposService) {}

  @Post()
  create(@Body() createEquipoDto: CreateEquipoDto) {
    return this.equiposService.create(createEquipoDto);
  }

  @Get('/bycampeonato/:id')
  findAll(@Param('id') id: string) {
    return this.equiposService.findAll(+id);
  }

  @Get('/bycategoria/:id')
  filtrarEquiposByCategoria(@Param('id') id: string) {
    return this.equiposService.filtrarEquiposByCategoria(+id);
  }
  @Get('/bycategoria/:categoriaId/bycampeonato/:campeonatoId')
  getEquiposByCategoriaAndCampeonato(@Param('categoriaId') categoriaId: string,@Param('campeonatoId') campeonatoId: string) {
    return this.equiposService.getEquiposByCategoriaAndCampeonato(+categoriaId,+campeonatoId);
  }


  @Get('/count/:id')
  contarEquipos(@Param('id') id: string){
    return this.equiposService.contarEquipos(+id);
  }

  @Get('/count/:categoriaid/:campeonatoid')
  contarEquiposByCategoria(@Param('categoriaid') idcat: string,@Param('campeonatoid') idcam: string){
    return this.equiposService.contarEquiposByCategoria(+idcat,+idcam);
  }


  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.equiposService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateEquipoDto: UpdateEquipoDto) {
    return this.equiposService.update(+id, updateEquipoDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.equiposService.remove(+id);
  }
}
