import { Injectable } from '@nestjs/common';
import { CreateCategoriaDto } from './dto/create-categoria.dto';
import { UpdateCategoriaDto } from './dto/update-categoria.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Categoria } from './entities/categoria.entity';
import { Repository } from 'typeorm';

@Injectable()
export class CategoriasService {
  
  constructor(
    @InjectRepository(Categoria)
    private readonly categoriaRepository: Repository<Categoria>

  ){}

  async create(createCategoriaDto: CreateCategoriaDto) {
    return await this.categoriaRepository.save(createCategoriaDto);
  }

  async findAll() {
    return await this.categoriaRepository.find();
  }

  async findOne(id: number) {
    return await this.categoriaRepository.findOneBy({id});
  }

  async contarCategorias(){
    const count = await this.categoriaRepository.count();
    return count;
  }


  async update(id: number, updateCategoriaDto: UpdateCategoriaDto) {
    return await this.categoriaRepository.update(id, updateCategoriaDto);
  }

  async remove(id: number) {
    return await this.categoriaRepository.softDelete({id});
  }
}
