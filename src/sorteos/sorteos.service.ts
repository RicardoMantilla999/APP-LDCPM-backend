import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { CreateSorteoDto } from './dto/create-sorteo.dto';
import { UpdateSorteoDto } from './dto/update-sorteo.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Not, Repository } from 'typeorm';
import { Categoria } from 'src/categorias/entities/categoria.entity';
import { Equipo } from 'src/equipos/entities/equipo.entity';
import { Sorteo } from './entities/sorteo.entity';

@Injectable()

export class SorteosService {

  constructor(
    @InjectRepository(SorteosService)
    private readonly sorteoRepository: Repository<Sorteo>,

    @InjectRepository(Categoria)
    private readonly categoriaRepository: Repository<Categoria>,

    @InjectRepository(Equipo)
    private readonly equipoRepository: Repository<Equipo>
  ){}

  async create(createSorteoDto: CreateSorteoDto) {
    const { equipo, categoria, nro_sorteo } = createSorteoDto;
  
    // Verificar si el equipo existe
    const equipoExistente = await this.equipoRepository.findOneBy({ id: equipo });
    if (!equipoExistente) {
      throw new NotFoundException(`Equipo con ID ${equipo} no encontrado`);
    }
  
    // Verificar si la categoría existe
    const categoriaExistente = await this.categoriaRepository.findOneBy({ id: categoria });
    if (!categoriaExistente) {
      throw new NotFoundException(`Categoría con ID ${categoria} no encontrada`);
    }
  
    // Verificar si ya existe un sorteo con el mismo número para esa categoría
    const sorteoExistente = await this.sorteoRepository.findOne({
      where: { nro_sorteo, categoria: { id: categoria } },
    });
    if (sorteoExistente) {
      throw new BadRequestException(
        `El número de sorteo ${nro_sorteo} ya está asignado en la categoría con ID ${categoria}`
      );
    }
  
    // Crear el nuevo sorteo
    const nuevoSorteo = this.sorteoRepository.create({
      nro_sorteo,
      equipo: equipoExistente,
      categoria: categoriaExistente,
    });
  
    return await this.sorteoRepository.save(nuevoSorteo);
  }
  
  

  async findAll() {
    return await this.sorteoRepository.find({
      relations: ['equipo', 'categoria'],
    });
  }

  async findOne(id: number) {
    const sorteo = await this.sorteoRepository.findOne({
      where: { id },
      relations: ['equipo', 'categoria'],
    });
  
    if (!sorteo) {
      throw new NotFoundException(`Sorteo con ID ${id} no encontrado`);
    }
  
    return sorteo;
  }
  

  
  // async update(id: number, updateSorteoDto: UpdateSorteoDto) {
  //   const { equipo, categoria, nro_sorteo } = updateSorteoDto;
  
  //   // Verificar si el sorteo existe
  //   const sorteo = await this.sorteoRepository.findOne({
  //     where: { id },
  //     relations: ['equipo', 'categoria'], // Asegura cargar las relaciones existentes
  //   });
  
  //   if (!sorteo) {
  //     throw new NotFoundException(`Sorteo con ID ${id} no encontrado`);
  //   }
  
  //   // Verificar si el equipo existe (si se proporcionó)
  //   if (equipo) {
  //     const equipoExistente = await this.equipoRepository.findOneBy({ id: equipo });
  //     if (!equipoExistente) {
  //       throw new NotFoundException(`Equipo con ID ${equipo} no encontrado`);
  //     }
  //     sorteo.equipo = equipoExistente; // Actualizar equipo
  //   }
  
  //   // Verificar si la categoría existe (si se proporcionó)
  //   if (categoria) {
  //     const categoriaExistente = await this.categoriaRepository.findOneBy({ id: categoria });
  //     if (!categoriaExistente) {
  //       throw new NotFoundException(`Categoría con ID ${categoria} no encontrada`);
  //     }
  //     sorteo.categoria = categoriaExistente; // Actualizar categoría
  //   }
  
  //   // Verificar si el número de sorteo ya existe en la categoría (si se proporcionó)
  //   if (nro_sorteo) {
  //     const sorteoDuplicado = await this.sorteoRepository.findOne({
  //       where: {
  //         nro_sorteo,
  //         categoria: categoria, //|| sorteo.categoria.id, // Usar la categoría existente si no se actualiza
  //         id: Not(id), // Excluir el sorteo actual
  //       },
  //     });
  
  //     if (sorteoDuplicado) {
  //       throw new BadRequestException(
  //         `El número de sorteo ${nro_sorteo} ya está asignado en la categoría con ID ${
  //           categoria || sorteo.categoria.id
  //         }`
  //       );
  //     }
  
  //     sorteo.nro_sorteo = nro_sorteo; // Actualizar número de sorteo
  //   }
  
  //   // Guardar los cambios
  //   return await this.sorteoRepository.save(sorteo);
  // }
  
  

  async remove(id: number) {
    const sorteo = await this.sorteoRepository.findOneBy({ id });
    if (!sorteo) {
      throw new NotFoundException(`Sorteo con ID ${id} no encontrado`);
    }
  
    await this.sorteoRepository.remove(sorteo);
  }
  
}
