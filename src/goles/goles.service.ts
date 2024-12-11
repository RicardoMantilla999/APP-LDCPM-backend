import { Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { CreateGoleDto } from './dto/create-gole.dto';
import { UpdateGoleDto } from './dto/update-gole.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Gole } from './entities/gole.entity';
import { Repository } from 'typeorm';
import { Jugador } from 'src/jugadores/entities/jugador.entity';
import { Partido } from 'src/partidos/entities/partido.entity';
import { Equipo } from 'src/equipos/entities/equipo.entity';
import { Fase } from 'src/fases/entities/fase.entity';
import { Campeonato } from 'src/campeonatos/entities/campeonato.entity';
import { Categoria } from 'src/categorias/entities/categoria.entity';

@Injectable()
export class GolesService {

  @InjectRepository(Gole)
  private readonly golesRepository: Repository<Gole>

  @InjectRepository(Jugador)
  private readonly jugadoresRepository: Repository<Jugador>

  @InjectRepository(Partido)
  private readonly partidosRepository: Repository<Partido>

  @InjectRepository(Equipo)
  private readonly equiposRepository: Repository<Equipo>

  async create(createGolDto: CreateGoleDto): Promise<Gole> {
    const { jugadorId, partidoId, equipoId, goles } = createGolDto;

    const jugador = await this.jugadoresRepository.findOne({ where: { id: jugadorId } });
    if (!jugador) {
      throw new NotFoundException('El jugador especificado no existe.');
    }

    const partido = await this.partidosRepository.findOne({ where: { id: partidoId } });
    if (!partido) {
      throw new NotFoundException('El partido especificado no existe.');
    }

    const equipo = await this.equiposRepository.findOne({ where: { id: equipoId } });
    if (!equipo) {
      throw new NotFoundException('El equipo especificado no existe.');
    }


    // Crear la instancia del gol
    const nuevoGol = this.golesRepository.create({
      jugador,
      partido,
      equipo,
      goles,
    });

    return await this.golesRepository.save(nuevoGol);
  }



  async findAll() {
    return await this.golesRepository.find();
  }

  async findOne(id: number) {
    return await this.golesRepository.findOneBy({ id });
  }

  async update(id: number, updateGolDto: UpdateGoleDto): Promise<Gole> {
    const { jugadorId, partidoId, equipoId, goles } = updateGolDto;

    const golExistente = await this.golesRepository.findOne({ where: { id } });
    if (!golExistente) {
      throw new NotFoundException('El registro de gol especificado no existe.');
    }

    if (jugadorId) {
      const jugador = await this.jugadoresRepository.findOne({ where: { id: jugadorId } });
      if (!jugador) {
        throw new NotFoundException('El jugador especificado no existe.');
      }
      golExistente.jugador = jugador;
    }

    if (partidoId) {
      const partido = await this.partidosRepository.findOne({ where: { id: partidoId } });
      if (!partido) {
        throw new NotFoundException('El partido especificado no existe.');
      }
      golExistente.partido = partido;
    }

    if (equipoId) {
      const equipo = await this.equiposRepository.findOne({ where: { id: equipoId } });
      if (!equipo) {
        throw new NotFoundException('El equipo especificado no existe.');
      }
      golExistente.equipo = equipo;
    }

    if (goles !== undefined) {
      golExistente.goles = goles;
    }

    return await this.golesRepository.save(golExistente);
  }


  remove(id: number) {
    return `This action removes a #${id} gole`;
  }

  async guardarGoles(jugadorId: number, goles: number, partidoId: number, equipoId: number): Promise<void> {
   
    // Buscar el jugador, equipo y partido por sus IDs
    const jugador = await this.jugadoresRepository.findOne({ where: { id: jugadorId } });
    const equipo = await this.equiposRepository.findOne({ where: { id: equipoId } });
    const partido = await this.partidosRepository.findOne({ where: { id: partidoId } });
  
    // Verificar si existen los registros
    if (!jugador || !equipo || !partido) {
      throw new Error('Jugador, equipo o partido no encontrado');
    }
  
    // Crear un nuevo registro de goles
    const nuevoGol = this.golesRepository.create({
      goles, // Cantidad de goles
      jugador, // Relación con el jugador
      equipo,  // Relación con el equipo
      partido  // Relación con el partido
    });
  
    // Guardar el nuevo registro en la base de datos
    await this.golesRepository.save(nuevoGol);
  
    await this.actualizarResultadoPartido(partidoId);
  }

  async actualizarResultadoPartido(partidoId: number): Promise<void> {
    try {
      // Obtén el partido incluyendo las relaciones necesarias
      const partido = await this.partidosRepository.findOne({
        where: { id: partidoId },
        relations: ['goles', 'equipo_1', 'equipo_2'], // Incluye relaciones necesarias
      });

      if (!partido) {
        throw new NotFoundException(`El partido con ID ${partidoId} no existe.`);
      }

      // Calcula los goles para cada equipo
      const golesEquipo1 = partido.goles
        .filter((gol) => gol.equipo.id === partido.equipo_1.id)
        .reduce((total, gol) => total + gol.goles, 0);

      const golesEquipo2 = partido.goles
        .filter((gol) => gol.equipo.id === partido.equipo_2.id)
        .reduce((total, gol) => total + gol.goles, 0);

      // Asegúrate de que los resultados son válidos (evita undefined o NaN)
      if (isNaN(golesEquipo1) || isNaN(golesEquipo2)) {
        throw new Error('Los goles calculados son inválidos.');
      }

      // Actualiza los goles en la entidad Partido
      partido.goles_1 = golesEquipo1;
      partido.goles_2 = golesEquipo2;

      // Guarda los cambios en la base de datos
      await this.partidosRepository.save(partido);

      console.log(`Partido actualizado: Equipo 1 (${golesEquipo1}) - Equipo 2 (${golesEquipo2})`);
    } catch (error) {
      console.error('Error al actualizar el resultado del partido:', error);
      throw new InternalServerErrorException('Error al actualizar el resultado del partido.');
    }
  }




}
