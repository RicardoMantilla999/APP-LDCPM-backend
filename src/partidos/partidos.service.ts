import { Injectable, NotFoundException } from '@nestjs/common';
import { CreatePartidoDto } from './dto/create-partido.dto';
import { UpdatePartidoDto } from './dto/update-partido.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Partido } from './entities/partido.entity';
import { Repository } from 'typeorm';
import { Equipo } from 'src/equipos/entities/equipo.entity';
import { Fase } from 'src/fases/entities/fase.entity';
import { Categoria } from 'src/categorias/entities/categoria.entity';

@Injectable()
export class PartidosService {


  constructor(
    @InjectRepository(Partido)
    private partidoRepository: Repository<Partido>,
    @InjectRepository(Equipo)
    private equipoRepository: Repository<Equipo>,
    @InjectRepository(Fase)
    private faseRepository: Repository<Fase>,
    @InjectRepository(Categoria)
    private categoriaRepository: Repository<Categoria>,
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


  async obtenerFechas(categoriaId: number): Promise<number[]> {
    try {
      const partidos = await this.partidoRepository.find({
        where: { categoria: { id: categoriaId } }, // Relaciona con la categoría por ID.
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




}
