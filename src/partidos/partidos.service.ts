import { Injectable } from '@nestjs/common';
import { CreatePartidoDto } from './dto/create-partido.dto';
import { UpdatePartidoDto } from './dto/update-partido.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Partido } from './entities/partido.entity';
import { Repository } from 'typeorm';

@Injectable()
export class PartidosService {


  constructor(
    @InjectRepository(Partido)
    private readonly partidoRepository: Repository<Partido>,
  ){}

  async create(createPartidoDto: CreatePartidoDto) {
    //return await this.partidoRepository.save(createPartidoDto);
  }

  async findAll() {
    return await this.partidoRepository.find();
  }

  async findOne(id: number) {
    return await this.partidoRepository.findBy({id});
  }

  async update(id: number, updatePartidoDto: UpdatePartidoDto) {
    //return await this.partidoRepository.update(id, updatePartidoDto);
  }

  async remove(id: number) {
    return await this.partidoRepository.delete({id});
  }
}
