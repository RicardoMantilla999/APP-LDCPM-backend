import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { CategoriasService } from './categorias.service';
import { CreateCategoriaDto } from './dto/create-categoria.dto';
import { UpdateCategoriaDto } from './dto/update-categoria.dto';

@Controller('categorias')
export class CategoriasController {
  constructor(private readonly categoriasService: CategoriasService) { }

  @Post()
  create(@Body() createCategoriaDto: CreateCategoriaDto) {
    return this.categoriasService.create(createCategoriaDto);
  }

  @Get()
  findAll() {
    return this.categoriasService.findAll();
  }

  @Get('/bycampeonato/:id')
  findCategoriasByCampeonato(@Param('id') id: string) {
    return this.categoriasService.findCategoriasByCampeonato(+id);
  }

  @Get('/count/:id')
  contarCategorias(@Param('id') id: string) {
    return this.categoriasService.contarCategorias(+id);
  }


  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.categoriasService.findOne(+id);
  }


  @Patch(':id')
  update(@Param('id') id: string, @Body() updateCategoriaDto: UpdateCategoriaDto) {
    return this.categoriasService.update(+id, updateCategoriaDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.categoriasService.remove(+id);
  }


  @Get(':categoriaId/fase-actual')
  async obtenerFaseActual(@Param('categoriaId') categoriaId: number) {
    return await this.categoriasService.obtenerFaseActual(categoriaId);
  }

}
