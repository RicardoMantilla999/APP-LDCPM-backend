import { Controller, Get, Post, Body, Patch, Param, Delete, UploadedFile, BadRequestException, UseInterceptors, Query, InternalServerErrorException } from '@nestjs/common';
import { JugadoresService } from './jugadores.service';
import { CreateJugadoreDto } from './dto/create-jugadore.dto';
import { UpdateJugadoreDto } from './dto/update-jugadore.dto';
import { FileInterceptor } from '@nestjs/platform-express';


@Controller('jugadores')
export class JugadoresController {
  constructor(private readonly jugadoresService: JugadoresService) { }

  @Post()
  @UseInterceptors(FileInterceptor('foto'))
  create(
    @Body() createJugadorDto: CreateJugadoreDto,
    @UploadedFile() file?: Express.Multer.File,
  ) {
    return this.jugadoresService.create(createJugadorDto, file);
  }


  @Get('/bycampeonato/:id')
  findAll(@Param('id') id: string) {
    return this.jugadoresService.findAll(+id);
  }

  @Get('/count/:id')
  contarJugadores(@Param('id') id: string) {
    return this.jugadoresService.contarJugadores(+id);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.jugadoresService.findOne(+id);
  }

  @Get('/byequipo/:id')
  filtrarJugadoresByEquipo(@Param('id') id: string) {
    return this.jugadoresService.filtrarJugadoresByEquipo(+id);
  }

  // @Get('/historial')
  // async obtenerHistorial(
  //   @Query('buscar') buscar?: string // Campo opcional para buscar jugadores
  // ) {
  //   return this.jugadoresService.obtenerHistorialJugadores(buscar);
  // }


  @Get('/historial/:cedula')
  async obtenerHistorialPorCedula(@Param('cedula') cedula: string) {
    if (!cedula) {
      throw new BadRequestException('La cédula es requerida.');
    }
    return this.jugadoresService.obtenerHistorialPorCedula(cedula);
  }

  @Get('/historial-todos')
  async obtenerHistorialDeTodosLosJugadores() {
    try {
      return this.jugadoresService.obtenerHistorialTodosLosJugadores();
    } catch (error) {
      throw new InternalServerErrorException('Error al obtener el historial de jugadores.');
    }
  }


  @Patch(':id')
  @UseInterceptors(FileInterceptor('foto'))
  update(
    @Param('id') id: string,
    @Body() updateJugadorDto: UpdateJugadoreDto,
    @UploadedFile() file?: Express.Multer.File,
  ) {
    return this.jugadoresService.update(+id, updateJugadorDto, file);
  }


  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.jugadoresService.remove(+id);
  }



  @Post('importar')
  @UseInterceptors(FileInterceptor('file'))
  async importarJugadores(
    @UploadedFile() file: Express.Multer.File,
    @Body('equipoId') equipoId: number, // Recibimos el ID del equipo
  ) {
    return this.jugadoresService.importarJugadores(file, equipoId);
  }

}
