import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { CreateEquipoDto } from './dto/create-equipo.dto';
import { UpdateEquipoDto } from './dto/update-equipo.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Equipo } from './entities/equipo.entity';
import { Repository } from 'typeorm';
import { Categoria } from 'src/categorias/entities/categoria.entity';
import { Dirigente } from 'src/dirigentes/entities/dirigente.entity';
import { Campeonato } from 'src/campeonatos/entities/campeonato.entity';

@Injectable()
export class EquiposService {

  constructor(
    @InjectRepository(Equipo)
    private readonly equipoRepository: Repository<Equipo>,

    @InjectRepository(Categoria)
    private readonly categoriaRepository: Repository<Categoria>,

    @InjectRepository(Dirigente)
    private readonly dirigenteRepository: Repository<Dirigente>,

    @InjectRepository(Campeonato)
    private readonly campeonatoRepository: Repository<Campeonato>
  ) { }

  async create(createEquipoDto: CreateEquipoDto) {
    // Verificar si la categoría existe
    const categoria = await this.categoriaRepository.findOneBy({
      id: createEquipoDto.categoria,
    });
    if (!categoria) {
      throw new NotFoundException('Categoría no encontrada');
    }

    // Verificar si el dirigente existe
    const dirigente = await this.dirigenteRepository.findOne({
      where: { id: createEquipoDto.dirigente },
    });
    if (!dirigente) {
      throw new NotFoundException('Dirigente no encontrado');
    }
    //Verificar campeonato
    const campeonato = await this.campeonatoRepository.findOne({
      where: { id: createEquipoDto.campeonato },
    });
    if (!campeonato) {
      throw new NotFoundException('Camponato no encontrado');
    }

    // Verificar si ya existe un equipo con el mismo nombre en la misma categoría
    const equipoExistente = await this.equipoRepository.findOne({
      where: {
        nombre: createEquipoDto.nombre,
        categoria: { id: createEquipoDto.categoria },
        campeonato: { id: createEquipoDto.campeonato },
      },
      relations: ['categoria', 'campeonato'], // Para asegurarte de que las relaciones se resuelvan correctamente
    });

    if (equipoExistente) {
      throw new BadRequestException(
        "El equipo" + createEquipoDto.nombre + " ya existe en la categoría " + categoria.categoria + "."
      );
    }

    // Crear y guardar el nuevo equipo
    const equipo = this.equipoRepository.create({
      ...createEquipoDto,
      categoria,
      dirigente,
      campeonato
    });

    return this.equipoRepository.save(equipo);
  }



  async findAll(idCampeonato: number) {
    return await this.equipoRepository.findBy({
      campeonato: { id: idCampeonato }// Relación con la categoría
    });
  }

  async findAllEquipos() {
    return await this.equipoRepository.find({
      relations: ['categoria', 'dirigente'], // Relaciones con categoria y dirigente
      select: {
        id: true, // id del equipo
        nombre: true, // nombre del equipo
        categoria: {
          categoria: true, // solo el nombre de la categoría
        },
        dirigente: {
          nombres: true, // solo el nombre del dirigente
        },
      },
    });
  }



  async findEquiposFull() {
    return await this.equipoRepository
      .createQueryBuilder('equipo')
      .leftJoinAndSelect('equipo.categoria', 'categoria')
      .leftJoinAndSelect('equipo.dirigente', 'dirigente')
      .select([
        'equipo.nombre', // selecciona el ID del equipo
        'equipo.uniforme', // selecciona el nombre del equipo
        'equipo.fecha_fundacion',
        'categoria.categoria', // selecciona solo el nombre de la categoría
        'dirigente.nombres', // selecciona solo el nombre del dirigente
      ])
      .getMany();
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
        where: { id: updateEquipoDto.dirigente }
      })
      if (!categoria) {
        throw new NotFoundException(`Categoria with ID ${updateEquipoDto.categoria} not found`);
      }
      if (!dirigente) {
        throw new NotFoundException(`Dirigente with ID ${updateEquipoDto.dirigente} not found`);
      }
      equipo.categoria = categoria;
    }
    return await this.equipoRepository.save(equipo);
  }

  async remove(id: number) {
    return await this.equipoRepository.delete({ id });
  }


  async contarEquipos(campeonatoId: number) {
    const count = await this.equipoRepository.count({ where: { campeonato: { id: campeonatoId } } });
    return count;
  }

  async contarEquiposByCategoria(categoriaId: number, campeonatoId: number) {
    const count = await this.equipoRepository.count({
      where: {
        campeonato: { id: campeonatoId },
        categoria: { id: categoriaId }
      }
    })
    return count;
  }

  async actualizarNroSorteo(equipos: { id: number; nro_sorteo: number }[]) {
    const actualizaciones = equipos.map(async (equipo) => {
      await this.equipoRepository.update(equipo.id, { nro_sorteo: equipo.nro_sorteo });
    });

    await Promise.all(actualizaciones);
    return { message: 'Números de sorteo actualizados correctamente.' };
  }


  async filtrarEquiposByCategoria(categoriaId: number): Promise<Equipo[]> {
    return this.equipoRepository.find({
      where: { categoria: { id: categoriaId } },
      relations: ['categoria'], // Incluye la relación con la categoría
    });
  }

  async getEquiposByCategoriaAndCampeonato(categoriaId: number, campeonatoId: number) {
    return this.equipoRepository.find({
      where: { categoria: { id: categoriaId }, campeonato: { id: campeonatoId } },
      relations: ['categoria'], // Incluye la relación con la categoría
    });
  }

}
