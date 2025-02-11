import { Controller, Get, Post, Body, Patch, Param, Delete, NotFoundException, BadRequestException, ParseIntPipe, InternalServerErrorException, UseGuards, HttpException, HttpStatus } from '@nestjs/common';
import { CampeonatosService } from 'src/campeonatos/campeonatos.service';
import { CreateCampeonatoDto } from 'src/campeonatos/dto/create-campeonato.dto';
import { UpdateCampeonatoDto } from 'src/campeonatos/dto/update-campeonato.dto';
import { Partido } from 'src/partidos/entities/partido.entity';
import { Campeonato } from 'src/campeonatos/entities/campeonato.entity';

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

  @Post('calendario-cuartos/:categoriaId')
  async generarNuevoCalendario(@Param('categoriaId') categoriaId: number): Promise<void> {
    try {
      await this.campeonatosService.generarCalendarioCuartos(categoriaId);
      return console.log('Calendario generado correctamente');
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }

  // Generar calendario para semifinales
  @Post('generar/semifinales/:categoriaId')
  async generarSemifinales(@Param('categoriaId') categoriaId: number){
    await this.campeonatosService.generarCalendarioSemifinales(categoriaId);
  }

  // Generar calendario para la final
  @Post('generar/final/:categoriaId')
  async generarFinal(@Param('categoriaId') categoriaId: number) {
      await this.campeonatosService.generarCalendarioFinal(categoriaId);
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
