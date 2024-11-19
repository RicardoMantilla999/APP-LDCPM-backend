import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { FasesService } from './fases.service';
import { CreateFaseDto } from './dto/create-fase.dto';
import { UpdateFaseDto } from './dto/update-fase.dto';

@Controller('fases')
export class FasesController {
  constructor(private readonly fasesService: FasesService) {}

  @Post()
  create(@Body() createFaseDto: CreateFaseDto) {
    return this.fasesService.create(createFaseDto);
  }

  @Get()
  findAll() {
    return this.fasesService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.fasesService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateFaseDto: UpdateFaseDto) {
    return this.fasesService.update(+id, updateFaseDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.fasesService.remove(+id);
  }
}
