import { Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { CreatePartidoDto } from './dto/create-partido.dto';
import { UpdatePartidoDto } from './dto/update-partido.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Partido } from './entities/partido.entity';
import { Repository, DataSource } from 'typeorm';
import { Equipo } from 'src/equipos/entities/equipo.entity';
import { Fase } from 'src/fases/entities/fase.entity';
import { Categoria } from 'src/categorias/entities/categoria.entity';
import { Gole } from 'src/goles/entities/gole.entity';
import { Posicione } from 'src/posiciones/entities/posicione.entity';
import { PosicionesService } from 'src/posiciones/posiciones.service';

@Injectable()
export class PartidosService {


  constructor(
    @InjectRepository(Partido)
    private readonly partidoRepository: Repository<Partido>,
    private readonly posicionService: PosicionesService,

  ) { }

  async create(createPartidoDto: CreatePartidoDto) {
    //return await this.partidoRepository.save(createPartidoDto);
  }





  async findAll(fase: number, categoria: number, fecha: number) {
    return await this.partidoRepository.find({
      where: {
        categoria: { id: categoria },
        fase: { id: fase },
        nro_fecha: fecha
      },
      order: {
        fecha: 'ASC', // Ordena por fecha ascendente
        hora: 'ASC',  // Ordena por hora ascendente
      },
    });
  }

  async getPartidosAgrupadosPorFecha(fase: number, categoria: number) {
    const partidos = await this.partidoRepository.find({
      where: { categoria: { id: categoria }, fase: { id: fase } },
      order: { nro_fecha: 'ASC', fecha: 'ASC', hora: 'ASC' },
    });

    // Retorna directamente un array en lugar de un objeto agrupado
    return partidos;
  }





  async findOne(id: number) {
    return await this.partidoRepository.findBy({ id });
  }

  async update(id: number, updatePartidoDto: UpdatePartidoDto): Promise<Partido> {
    const partido = await this.partidoRepository.findOneBy({ id });

    if (!partido) {
      throw new NotFoundException('El partido no existe');
    }

    // Actualiza solo los campos proporcionados
    partido.fecha = updatePartidoDto.fecha ?? partido.fecha;
    partido.hora = updatePartidoDto.hora ?? partido.hora;

    // Guarda y retorna el partido actualizado
    return await this.partidoRepository.save(partido);
  }

  async remove(id: number) {
    return await this.partidoRepository.delete({ id });
  }


  async obtenerFechas(categoriaId: number, faseId: number): Promise<number[]> {
    try {
      const partidos = await this.partidoRepository.find({
        where: { categoria: { id: categoriaId }, fase: { id: faseId } }, // Relaciona con la categoría por ID.
        relations: ['categoria'], // Incluye la relación explícitamente.
        order: { nro_fecha: 'ASC' }, // Asegura el orden ascendente.
      });

      // Extrae los números de fecha únicos.
      const fechasUnicas = [...new Set(partidos.map(partido => partido.nro_fecha))];
      return fechasUnicas;
    } catch (error) {
      console.error('Error en obtenerFechas:', error.message, error.stack);
      throw new Error('No se pudieron obtener las fechas disponibles.');
    }
  }

  async actualizarResultadoPartido(partidoId: number): Promise<void> {
    try {
      // Obtén el partido incluyendo las relaciones necesarias
      const partido = await this.partidoRepository.findOne({
        where: { id: partidoId },
        relations: ['goles', 'equipo_1', 'equipo_2'], // Relaciona equipos y goles
      });

      if (!partido) {
        throw new NotFoundException(`El partido con ID ${partidoId} no existe.`);
      }

      // Calcula los goles de cada equipo a partir de los registros de la tabla "Goles"
      const golesEquipo1 = partido.goles
        .filter((gol) => gol.equipo.id === partido.equipo_1.id)
        .reduce((total, gol) => total + gol.goles, 0);

      const golesEquipo2 = partido.goles
        .filter((gol) => gol.equipo.id === partido.equipo_2.id)
        .reduce((total, gol) => total + gol.goles, 0);

      // Asegúrate de que los resultados sean válidos
      if (isNaN(golesEquipo1) || isNaN(golesEquipo2)) {
        throw new Error('Los goles calculados son inválidos.');
      }

      // Actualiza los campos goles_1 y goles_2 en la entidad Partido
      partido.goles_1 = golesEquipo1;
      partido.goles_2 = golesEquipo2;

      // Guarda los cambios en la base de datos
      await this.partidoRepository.save(partido);

      console.log(`Resultado actualizado: Equipo 1 (${golesEquipo1}) - Equipo 2 (${golesEquipo2})`);
    } catch (error) {
      console.error('Error al actualizar el resultado del partido:', error);
      throw new InternalServerErrorException('Error al actualizar el resultado del partido.');
    }
  }




  // usando actualmente 2024 
  async actualizarPartido(id: number, cambios: Partial<Partido>): Promise<Partido> {
    // Buscar el partido por ID
    const partido = await this.partidoRepository.findOne({ where: { id }, relations: ['fase'] });

    if (!partido) {
      throw new NotFoundException(`No se encontró el partido con ID ${id}`);
    }

    // Actualizar solo los campos enviados en el cuerpo de la petición
    Object.assign(partido, cambios);

    // Guardar el partido con los cambios
    const partidoActualizado = await this.partidoRepository.save(partido);

    // Si el cambio incluye `culminado: true`, actualiza la tabla de posiciones
    if (cambios.culminado === true && partido.fase.orden === 1) {
      //if (partido.fase.orden === 1) {
      await this.posicionService.actualizarTablaPosiciones(id);
      //}
    }

    return partidoActualizado;
  }

  async obtenerPartidosFaseCuartos(categoriaId: number): Promise<Partido[]> {

    return this.partidoRepository.find({
      where: {
        categoria: { id: categoriaId },
        fase: { orden: 2 },
      },
      order: { grupo: { nombre: 'DESC' } },
      relations: ['categoria', 'fase'],
    });
  }

  async obtenerPartidosFaseSemifinal(categoriaId: number): Promise<Partido[]> {

    return this.partidoRepository.find({
      where: {
        categoria: { id: categoriaId },
        fase: { orden: 3 },
      },
      order: { grupo: { nombre: 'DESC' } },
      relations: ['categoria', 'fase'],
    });

  }

  async obtenerPartidosFaseFinal(categoriaId: number): Promise<Partido[]> {

    return this.partidoRepository.find({
      where: {
        categoria: { id: categoriaId },
        fase: { orden: 4 },
      },
      order: { grupo: { nombre: 'DESC' } },
      relations: ['categoria', 'fase'],
    });

  }


  async obtenerCampeon(categoriaId: number): Promise<Equipo> {
    const partidoFinal = await this.partidoRepository.findOne({
      where: {
        categoria: { id: categoriaId },
        fase: { orden: 4 }
      },
      relations: ['equipo_1', 'equipo_2'],
    });

    if (!partidoFinal) {
      throw new NotFoundException('No se encontró el partido de la final.');
    }

    // Determina el equipo ganador
    const campeon = partidoFinal.goles_1 > partidoFinal.goles_2
      ? partidoFinal.equipo_1
      : partidoFinal.equipo_2;

    return campeon;
  }

}
