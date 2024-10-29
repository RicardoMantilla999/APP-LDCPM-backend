import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateEquipoDto } from './dto/create-equipo.dto';
import { UpdateEquipoDto } from './dto/update-equipo.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Equipo } from './entities/equipo.entity';
import { Repository } from 'typeorm';
import { Categoria } from 'src/categorias/entities/categoria.entity';
import { Dirigente } from 'src/dirigentes/entities/dirigente.entity';

@Injectable()
export class EquiposService {

  constructor(
    @InjectRepository(Equipo)
    private readonly equipoRepository: Repository<Equipo>,

    @InjectRepository(Categoria)
    private readonly categoriaRepository: Repository<Categoria>,

    @InjectRepository(Dirigente)
    private readonly dirigenteRepository: Repository<Dirigente>
  ) { }

  async create(createEquipoDto: CreateEquipoDto) {
    const categoria = await this.categoriaRepository.findOneBy({
      id: createEquipoDto.categoria,
    });
    const dirigente = await this.dirigenteRepository.findOne({
      where: { id: createEquipoDto.dirigente }
    })
    if(!categoria){
      throw new NotFoundException('Categoria no encontrada');
    } 
    if(!dirigente){
      throw new NotFoundException('Dirigente no encontrado');
    } 
    

    const equipo = this.equipoRepository.create({ ...createEquipoDto, categoria, dirigente });

    return this.equipoRepository.save(equipo);
  }


  async findAll() {
    return await this.equipoRepository.find({
      relations: ['categoria', 'dirigente'], // Relación con la categoría
    });
  }
 


  async findOne(id: number) {
    return await this.equipoRepository.findOneBy({ id });
  }

  async update(id: number, updateEquipoDto: UpdateEquipoDto) {
    const equipo = await this.equipoRepository.findOne({ where: { id } });

    if (!equipo) {
      throw new NotFoundException(`Equipo with ID ${id} not found`);
    }
    // Actualizar los campos del equipo
    Object.assign(equipo, updateEquipoDto);
    // Si hay una categoría, podrías validar y asignarla
    if (updateEquipoDto.categoria) {
      const categoria = await this.categoriaRepository.findOne({
        where: { id: updateEquipoDto.categoria },
      });
      const dirigente = await this.dirigenteRepository.findOne({
        where: {id: updateEquipoDto.dirigente}
      })
      if (!categoria) {
        throw new NotFoundException(`Categoria with ID ${updateEquipoDto.categoria} not found`);
      }
      if (!dirigente){
        throw new NotFoundException(`Dirigente with ID ${updateEquipoDto.dirigente} not found`);
      }
      equipo.categoria = categoria;
    }
    return await this.equipoRepository.save(equipo);
  }

  async remove(id: number) {
    return await this.equipoRepository.softDelete({ id });
  }
}
