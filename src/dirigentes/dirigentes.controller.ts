import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { DirigentesService } from './dirigentes.service';
import { CreateDirigenteDto } from './dto/create-dirigente.dto';
import { UpdateDirigenteDto } from './dto/update-dirigente.dto';

@Controller('dirigentes')
export class DirigentesController {
  constructor(private readonly dirigentesService: DirigentesService) { }

  @Post()
  create(@Body() createDirigenteDto: CreateDirigenteDto) {
    return this.dirigentesService.create(createDirigenteDto);
  }

  @Get('/bycampeonato/:id')
  findAll(@Param('id') id: string) {
    return this.dirigentesService.findAll(+id);
  }

  @Get('/count/:id')
  contarDirigentes(@Param('id') id: string) {
    return this.dirigentesService.contarDirigentes(+id);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.dirigentesService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateDirigenteDto: UpdateDirigenteDto) {
    return this.dirigentesService.update(+id, updateDirigenteDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.dirigentesService.remove(+id);
  }
}
