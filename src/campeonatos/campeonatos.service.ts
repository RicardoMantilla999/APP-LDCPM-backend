import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateCampeonatoDto } from './dto/create-campeonato.dto';
import { UpdateCampeonatoDto } from './dto/update-campeonato.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Campeonato } from './entities/campeonato.entity';
import { Repository } from 'typeorm';
import { Partido } from 'src/partidos/entities/partido.entity';
import { Equipo } from 'src/equipos/entities/equipo.entity';
import { Categoria } from 'src/categorias/entities/categoria.entity';
import { Fase } from 'src/fases/entities/fase.entity';

@Injectable()
export class CampeonatosService {

  constructor(
    @InjectRepository(Campeonato)
    private readonly campeonatoRepository: Repository<Campeonato>,
    @InjectRepository(Partido)
    private readonly partidoRepository: Repository<Partido>,
    @InjectRepository(Equipo)
    private readonly equipoRepository: Repository<Equipo>,
    @InjectRepository(Fase)
    private readonly faseRepository: Repository<Fase>,
    @InjectRepository(Categoria)
    private readonly categoriaRepository: Repository<Categoria>

  ) { }

  async create(createCampeonatoDto: CreateCampeonatoDto) {
    return await this.campeonatoRepository.save(createCampeonatoDto);
  }


  async findAll() {
    return await this.campeonatoRepository.find();
  }

  async findOne(id: number) {
    return await this.campeonatoRepository.findOneBy({ id });
  }

  async update(campeonatoId: number, updateCampeonatoDto: UpdateCampeonatoDto) {
    // Buscar el campeonato por ID e incluir la relación con la fase_actual
    const campeonato = await this.campeonatoRepository.findOne({
      where: { id: campeonatoId },
      relations: ['fase_actual'],  // Asegúrate de incluir la relación con la fase
    });

    if (!campeonato) {
      throw new NotFoundException('Campeonato no encontrado');
    }

    // Actualizar nombre, fechas de inicio y fin si están presentes en el DTO
    if (updateCampeonatoDto.nombre) {
      campeonato.nombre = updateCampeonatoDto.nombre;
    }

    if (updateCampeonatoDto.fecha_inicio) {
      campeonato.fecha_inicio = updateCampeonatoDto.fecha_inicio;
    }

    if (updateCampeonatoDto.fecha_fin) {
      campeonato.fecha_fin = updateCampeonatoDto.fecha_fin;
    }


    // Guardamos los cambios
    return await this.campeonatoRepository.save(campeonato);
  }




  async remove(id: number) {
    return await this.campeonatoRepository.delete(id);
  }

  async generarCalendario(campeonatoId: number, categoriaId: number): Promise<Partido[]> {
    try {
      // Verifica si la categoría existe y obtiene la fase actual de la categoría
      const categoria = await this.categoriaRepository.findOne({
        where: { id: categoriaId, campeonato: { id: campeonatoId } },
        relations: ['fase_actual', 'campeonato'],
      });

      if (!categoria) {
        throw new NotFoundException('La categoría no fue encontrada en el campeonato especificado.');
      }

      const faseActual = categoria.fase_actual;
      if (!faseActual) {
        throw new Error('No hay una fase actual configurada para la categoría.');
      }

      // Verifica que la fase actual permita la generación del calendario
      if (faseActual.orden !== 0) {
        throw new Error('El calendario solo se puede generar en la fase de inscripción.');
      }

      // Obtén los equipos de la categoría específica
      const equipos = await this.equipoRepository.find({
        where: { categoria: { id: categoriaId }, campeonato: { id: campeonatoId } },
        relations: ['categoria'],
        order: { nro_sorteo: 'ASC' },
      });

      if (equipos.length < 2) {
        throw new Error('No hay suficientes equipos en la categoría para generar partidos.');
      }
      // Avanzar a la siguiente fase de la categoría
      const siguienteFase = await this.faseRepository.findOne({
        where: { orden: faseActual.orden + 1 },
      });

      if (!siguienteFase) {
        throw new Error('No se encontró la siguiente fase para la categoría.');
      }

      categoria.fase_actual = siguienteFase;
      await this.categoriaRepository.save(categoria);

      // Implementa el algoritmo para crear los enfrentamientos
      const totalEquipos = equipos.length;
      const totalFechas = totalEquipos - 1; // Cada equipo descansa una vez si son pares
      const partidos: Partido[] = [];

      for (let fecha = 0; fecha < totalFechas; fecha++) {
        for (let i = 0; i < totalEquipos / 2; i++) {
          const equipoLocal = equipos[i];
          const equipoVisitante = equipos[totalEquipos - i - 1];

          partidos.push(
            this.partidoRepository.create({
              equipo_1: equipoLocal,
              equipo_2: equipoVisitante,
              fase: siguienteFase,
              categoria: equipoLocal.categoria,
              nro_fecha: fecha + 1,
              culminado: false,
            }),
          );
        }

        // Rotación de equipos (sin incluir el primer equipo)
        const ultimoEquipo = equipos.pop();
        equipos.splice(1, 0, ultimoEquipo!);
      }

      // Guarda todos los partidos generados
      const nuevosPartidos = await this.partidoRepository.save(partidos);

      

      return nuevosPartidos;
    } catch (error) {
      console.error('Error en generarCalendario:', error.message, error.stack);
      throw error;
    }
  }


  async actualizarCampeonato(id: number, updateCampeonatoDto: UpdateCampeonatoDto): Promise<Campeonato> {
    // Buscar el campeonato por ID
    const campeonato = await this.campeonatoRepository.findOne({ where: { id } });

    if (!campeonato) {
      throw new NotFoundException(`El campeonato con ID ${id} no fue encontrado`);
    }

    // Actualizar el campeonato con los valores proporcionados en el DTO
    Object.assign(campeonato, updateCampeonatoDto);

    // Guardar los cambios en la base de datos
    return this.campeonatoRepository.save(campeonato);
  }

}






