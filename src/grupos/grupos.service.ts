import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateGrupoDto } from './dto/create-grupo.dto';
import { UpdateGrupoDto } from './dto/update-grupo.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Grupo } from './entities/grupo.entity';
import { Repository } from 'typeorm';
import { Fase } from 'src/fases/entities/fase.entity';
import { NotFoundError } from 'rxjs';

@Injectable()
export class GruposService {

  constructor(
    @InjectRepository(Grupo)
    private readonly grupoRepository: Repository<Grupo>,
    @InjectRepository(Fase)
    private readonly faseRepository: Repository<Fase>

  ) { }
  async create(createGrupoDto: CreateGrupoDto) {
    // Buscar la fase usando el ID proporcionado
    const fase = await this.faseRepository.findOne({ where: { id: createGrupoDto.fase } });
  
    if (!fase) {
      throw new NotFoundException('Fase no encontrada');
    }
    const grupo = this.grupoRepository.create({
      ...createGrupoDto// Asignar la entidad completa de fase
    });
    return await this.grupoRepository.save(grupo);
  }
  

  async findAll() {
    return await this.grupoRepository.find();
  }

  async findOne(id: number) {
    return await this.grupoRepository.findOneBy({ id });
  }

  async update(id: number, updateGrupoDto: UpdateGrupoDto) {
    // Buscar el grupo que deseas actualizar
    const grupo = await this.grupoRepository.findOne({ where: { id }, relations: ['fase'] });

    if (!grupo) {
      throw new NotFoundException("Grupo no encontrado");
    }

    // Buscar la fase asociada al nuevo ID de fase en el DTO
    const fase = await this.faseRepository.findOneBy({ id: updateGrupoDto.fase });

    if (!fase) {
      throw new NotFoundException("Fase no encontrada");
    }

    // Asignar los valores del DTO al grupo
    Object.assign(grupo, updateGrupoDto);
    // Guardar el grupo actualizado
    return await this.grupoRepository.save(grupo);
  }
  async remove(id: number) {
    return await this.faseRepository.delete(id);
  }
}