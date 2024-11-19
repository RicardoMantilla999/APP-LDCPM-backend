import { BadRequestException, Injectable } from '@nestjs/common';
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

  ) { }

  async create(createDirigenteDto: CreateDirigenteDto) {
    const { cedula } = createDirigenteDto;

    // Verificar si ya existe una categoría con el mismo nombre
    const dirigenteExistente = await this.dirigenteRepository.findOne({
      where: { cedula },
    });

    if (dirigenteExistente) {
      throw new BadRequestException('La cédula: ' + dirigenteExistente.cedula + ' ya existe.');
    }

    // Crear y guardar la nueva categoría
    const nuevoDirigente = this.dirigenteRepository.create(createDirigenteDto);
    //return await this.categoriaRepository.save(nuevaCategoria);
    return await this.dirigenteRepository.save(nuevoDirigente);

  }

  async findAll() {
    return await this.dirigenteRepository.find();
  }

  async contarDirigentes() {
    const count = await this.dirigenteRepository.count();
    return count;
  }

  async findOne(id: number) {
    return await this.dirigenteRepository.findOneBy({ id });
  }

  async update(id: number, updateDirigenteDto: UpdateDirigenteDto) {
    return await this.dirigenteRepository.update(id, updateDirigenteDto);
  }

  async remove(id: number) {
    return await this.dirigenteRepository.softDelete({ id });
  }
}
