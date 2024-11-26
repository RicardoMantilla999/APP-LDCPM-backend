import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
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
    private readonly jugadorRepository: Repository<Jugador>,
    @InjectRepository(Equipo)
    private readonly equipoRepository: Repository<Equipo>,
  ) { }

  async create(createJugadoreDto: CreateJugadoreDto) {
    const equipo = await this.equipoRepository.findOne({
      where: { id: createJugadoreDto.equipo },
      relations: ['campeonato'], // Incluimos la relación con campeonato
    });
  
    if (!equipo) {
      throw new NotFoundException('Equipo no encontrado');
    }
  
    const { cedula, dorsal } = createJugadoreDto;
  
    // Verificar si ya existe un jugador con la misma cédula en el mismo campeonato
    const jugadorExistenteEnCampeonato = await this.jugadorRepository.findOne({
      where: {
        cedula,
        equipo: {
          campeonato: { id: equipo.campeonato.id },
        },
      },
      relations: ['equipo', 'equipo.campeonato'],
    });
  
    if (jugadorExistenteEnCampeonato) {
      throw new BadRequestException(
        `La cédula ${cedula} ya está registrada en el Campeonato: ${equipo.campeonato.nombre}, Equipo: ${equipo.nombre}`,
      );
    }
  
    // Verificar si el dorsal ya está en uso dentro del mismo equipo
    const jugadorExistentePorDorsal = await this.jugadorRepository.findOne({
      where: {
        dorsal,
        equipo: { id: equipo.id },
      },
    });
  
    if (jugadorExistentePorDorsal) {
      throw new BadRequestException(
        `El dorsal ${dorsal} ya está asignado en el equipo ${equipo.nombre}.`,
      );
    }
  
    // Crear y guardar el nuevo jugador
    const jugador = this.jugadorRepository.create({
      ...createJugadoreDto,
      equipo,
    });
  
    return await this.jugadorRepository.save(jugador);
  }
  
  

  async findAll(id:number) {
    return await this.jugadorRepository.find({where : {equipo: {campeonato: {id : id}}}});
  }

  async contarJugadores(campeonatoId: number) {
    const count = await this.jugadorRepository.count({where:{ equipo: { campeonato: {id: campeonatoId}}}});
    return count;
  }

  async findOne(id: number) {
    return await this.jugadorRepository.findOneBy({ id });
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
      if (!equipo) {
        throw new NotFoundException(`Equipo con ID ${updateJugadorDto.equipo} No encontrado`);
      }
      jugador.equipo = equipo;
    }
    return await this.jugadorRepository.save(jugador);
  }

  async remove(id: number) {
    return await this.jugadorRepository.delete(id);
  }

  async filtrarJugadoresByEquipo(equipoId: number): Promise<Jugador[]> {
    return this.jugadorRepository.find({
      where: { equipo: { id: equipoId } }, // Filtra por equipo ID
      relations: ['equipo'], // Incluye la relación con el equipo
    });
  }

}
