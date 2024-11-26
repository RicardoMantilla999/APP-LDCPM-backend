import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { JugadoresService } from './jugadores.service';
import { CreateJugadoreDto } from './dto/create-jugadore.dto';
import { UpdateJugadoreDto } from './dto/update-jugadore.dto';

@Controller('jugadores')
export class JugadoresController {
  constructor(private readonly jugadoresService: JugadoresService) { }

  @Post()
  create(@Body() createJugadoreDto: CreateJugadoreDto) {
    return this.jugadoresService.create(createJugadoreDto);
  }

  @Get('/bycampeonato/:id')
  findAll(@Param('id') id: string)  {
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


  @Patch(':id')
  update(@Param('id') id: string, @Body() updateJugadoreDto: UpdateJugadoreDto) {
    return this.jugadoresService.update(+id, updateJugadoreDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.jugadoresService.remove(+id);
  }
}
