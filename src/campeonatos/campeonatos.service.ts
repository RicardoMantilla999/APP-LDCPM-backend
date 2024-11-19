import { Injectable } from '@nestjs/common';
import { CreateCampeonatoDto } from './dto/create-campeonato.dto';
import { UpdateCampeonatoDto } from './dto/update-campeonato.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Campeonato } from './entities/campeonato.entity';
import { Repository } from 'typeorm';

@Injectable()
export class CampeonatosService {

  constructor(
    @InjectRepository(Campeonato)
    private readonly campeonatoRepository: Repository<Campeonato>,
  ) { }

  async create(createCampeonatoDto: CreateCampeonatoDto) {
    return await this.campeonatoRepository.save(createCampeonatoDto);
  }


  async findAll() {
    return await this.campeonatoRepository.find();
  }

   async findOne(id: number) {
    return await this.campeonatoRepository.findOneBy({id});
  }

  async update(id: number, updateCampeonatoDto: UpdateCampeonatoDto) {
    return await this.campeonatoRepository.update(id, updateCampeonatoDto);
  }

  async remove(id: number) {
    return await this.campeonatoRepository.softDelete(id);
  }
}
