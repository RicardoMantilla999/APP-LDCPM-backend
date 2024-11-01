import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateJugadoreDto } from './dto/create-jugadore.dto';
import { UpdateJugadoreDto } from './dto/update-jugadore.dto';
import { Jugador } from './entities/jugador.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Equipo } from 'src/equipos/entities/equipo.entity';
import e from 'express';

@Injectable()
export class JugadoresService {

  constructor(
    @InjectRepository(Jugador)
    private readonly jugadorRepository:Repository<Jugador>,
    @InjectRepository(Equipo)
    private readonly equipoRepository:Repository<Equipo>,
  ){}

  async create(createJugadoreDto: CreateJugadoreDto) {
    const equipo = await this.equipoRepository.findOneBy({
      id: createJugadoreDto.equipo,
    }); 
    if(!equipo){
      throw new NotFoundException('Equipo no encontrado');
    } 
    

    const jugador = this.jugadorRepository.create({ ...createJugadoreDto, equipo});

    return this.jugadorRepository.save(jugador);
  }
  

  async findAll() {
    return await this.jugadorRepository.find();
  }

  async findOne(id: number) {
    return await this.jugadorRepository.findOneBy({id});
  }

  async update(id: number, updateJugadorDto: UpdateJugadoreDto) {
    const jugador = await this.jugadorRepository.findOne({ where: { id } });

    if (!jugador) {
      throw new NotFoundException(`Jugador con ID ${id} No encontrado`);
    }
    Object.assign(jugador, updateJugadorDto);
    // Si hay una categoría, podrías validar y asignarla
    if (updateJugadorDto.equipo) {
      const equipo = await this.equipoRepository.findOne({
        where: { id: updateJugadorDto.equipo },
      });
      if (!equipo){
        throw new NotFoundException(`Equipo con ID ${updateJugadorDto.equipo} No encontrado`);
      }
      jugador.equipo = equipo;
    }
    return await this.jugadorRepository.save(jugador);
  }

  async remove(id: number) {
    return await this.jugadorRepository.softDelete(id);
  }
}
