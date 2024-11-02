import { Injectable } from '@nestjs/common';
import { CreateArbitroDto } from './dto/create-arbitro.dto';
import { UpdateArbitroDto } from './dto/update-arbitro.dto';
import { Arbitro } from './entities/arbitro.entity';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class ArbitrosService {
  constructor(
    @InjectRepository(Arbitro)
    private readonly arbitroRepository: Repository<Arbitro>,

  ){}
  async create(createArbitroDto: CreateArbitroDto) {
    return await this.arbitroRepository.save(createArbitroDto);
  }

  async findAll() {
    return await this.arbitroRepository.find();
  }

  async contarArbitros(){
    const count = await this.arbitroRepository.count();
    return count;
  }

  async findOne(id: number) {
    return await this.arbitroRepository.findOneBy({id});
  }

  async update(id: number, updateArbitroDto: UpdateArbitroDto) {
    return await this.arbitroRepository.update(id,updateArbitroDto);
  }

  async remove(id: number) {
    return await this.arbitroRepository.softDelete(id);
  }
}
