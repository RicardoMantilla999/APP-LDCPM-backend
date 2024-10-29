import { Injectable } from '@nestjs/common';
import { CreateDirigenteDto } from './dto/create-dirigente.dto';
import { UpdateDirigenteDto } from './dto/update-dirigente.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Dirigente } from './entities/dirigente.entity';
import { Repository } from 'typeorm';

@Injectable()
export class DirigentesService {

  constructor(
    @InjectRepository(Dirigente)
    private readonly dirigenteRepository: Repository<Dirigente>,

  ){}

  async create(createDirigenteDto: CreateDirigenteDto) {
    return await this.dirigenteRepository.save(createDirigenteDto);
  }

  async findAll() {
    return await this.dirigenteRepository.find();
  }

  async findOne(id: number) {
    return await this.dirigenteRepository.findOneBy({id});
  }

  async update(id: number, updateDirigenteDto: UpdateDirigenteDto) {
    return await this.dirigenteRepository.update(id,updateDirigenteDto);
  }

  async remove(id: number) {
    return await this.dirigenteRepository.softDelete({id});
  }
}
