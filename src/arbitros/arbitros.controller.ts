import { Controller, Get, Post, Body, Patch, Param, Delete, UseFilters, UseGuards } from '@nestjs/common';
import { ArbitrosService } from './arbitros.service';
import { CreateArbitroDto } from './dto/create-arbitro.dto';
import { UpdateArbitroDto } from './dto/update-arbitro.dto';
import { AuthGuard } from 'src/auth/guard/auth.guard';

@Controller('arbitros')
export class ArbitrosController {
  constructor(private readonly arbitrosService: ArbitrosService) {}

  @Post()
  create(@Body() createArbitroDto: CreateArbitroDto) {
    return this.arbitrosService.create(createArbitroDto);
  }

  @Get('bycampeonato/:id')
  findAll(@Param('id') id: string) {
    return this.arbitrosService.findAll(+id);
  }

  @Get('/count/:id')
  contarArbitros(@Param('id') id: string){
    return this.arbitrosService.contarArbitros(+id);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.arbitrosService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateArbitroDto: UpdateArbitroDto) {
    return this.arbitrosService.update(+id, updateArbitroDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.arbitrosService.remove(+id);
  }
}
