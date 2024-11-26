import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { CreateDirigenteDto } from './dto/create-dirigente.dto';
import { UpdateDirigenteDto } from './dto/update-dirigente.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Dirigente } from './entities/dirigente.entity';
import { Repository } from 'typeorm';
import { Campeonato } from 'src/campeonatos/entities/campeonato.entity';

@Injectable()
export class DirigentesService {

  constructor(
    @InjectRepository(Dirigente)
    private readonly dirigenteRepository: Repository<Dirigente>,
    @InjectRepository(Campeonato)
    private readonly campeonatoRepository: Repository<Campeonato>

  ) { }

  async create(createDirigenteDto: CreateDirigenteDto) {
    const { cedula } = createDirigenteDto;

    const campeonato = await this.campeonatoRepository.findOne({
      where: { id: createDirigenteDto.campeonato }
    })
    if (!campeonato) {
      throw new NotFoundException('campeonato no encontrado')
    }

    // Verificar si ya existe una categoría con el mismo nombre
    const dirigenteExistente = await this.dirigenteRepository.findOne({
      where: { cedula },
    });

    if (dirigenteExistente) {
      throw new BadRequestException('La cédula: ' + dirigenteExistente.cedula + ' ya existe.');
    }

    // Crear y guardar la nueva categoría
    const nuevoDirigente = this.dirigenteRepository.create({ ...createDirigenteDto, campeonato });
    //return await this.categoriaRepository.save(nuevaCategoria);
    return await this.dirigenteRepository.save(nuevoDirigente);

  }

  async findAll(id: number) {
    return await this.dirigenteRepository.find({ where: { campeonato: { id: id } } });
  }

  async contarDirigentes(campeonatoId: number) {
    const count = await this.dirigenteRepository.count({ where: { campeonato: { id: campeonatoId } } });
    return count;
  }

  async findOne(id: number) {
    return await this.dirigenteRepository.findOneBy({ id });
  }

  async update(id: number, updateDirigenteDto: UpdateDirigenteDto) {
    return await this.dirigenteRepository.update(id, updateDirigenteDto);
  }

  async remove(id: number) {
    return await this.dirigenteRepository.delete({ id });
  }
}
