import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { CreateArbitroDto } from './dto/create-arbitro.dto';
import { UpdateArbitroDto } from './dto/update-arbitro.dto';
import { Arbitro } from './entities/arbitro.entity';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { Campeonato } from 'src/campeonatos/entities/campeonato.entity';

@Injectable()
export class ArbitrosService {
  constructor(
    @InjectRepository(Arbitro)
    private readonly arbitroRepository: Repository<Arbitro>,
    @InjectRepository(Campeonato)
    private readonly campeonatoRepository: Repository<Campeonato>,

  ) { }
  async create(createArbitroDto: CreateArbitroDto) {
    const { cedula } = createArbitroDto;

    // Verificar si ya existe una categoría con el mismo nombre
    const arbitroExistente = await this.arbitroRepository.findOne({
      where: { cedula },
    });

    if (arbitroExistente) {
      throw new BadRequestException('La cédula: ' + arbitroExistente.cedula + ' ya existe.');
    }
    const campeonato = await this.campeonatoRepository.findOne({ where: { id: createArbitroDto.campeonato } })

    if (!campeonato) {
      throw new NotFoundException('Campeonato no encontrado')
    }


    // Crear y guardar la nueva categoría
    const nuevoArbitro = await this.arbitroRepository.create({...createArbitroDto,campeonato});
    //return await this.categoriaRepository.save(nuevaCategoria);
    return await this.arbitroRepository.save(nuevoArbitro);

  }

  async findAll(id: number) {
    return await this.arbitroRepository.find({where: {campeonato: {id: id}}});
  }

  async contarArbitros(id: number) {
    const count = await this.arbitroRepository.count({where: {campeonato: {id: id}}});
    return count;
  }

  async findOne(id: number) {
    return await this.arbitroRepository.findOneBy({ id });
  }

  async update(id: number, updateArbitroDto: UpdateArbitroDto) {
    const { cedula, campeonato } = updateArbitroDto;
  
    // Verificar si el árbitro existe
    const arbitroExistente = await this.arbitroRepository.findOne({
      where: { id },
    });
  
    if (!arbitroExistente) {
      throw new NotFoundException('Arbitro no encontrado');
    }
  
    // Si se está actualizando el campeonato, verificamos que el campeonato exista
    if (campeonato) {
      const campeonatoExistente = await this.campeonatoRepository.findOne({
        where: { id: campeonato },
      });
  
      if (!campeonatoExistente) {
        throw new NotFoundException('Campeonato no encontrado');
      }
    }
  
    // Actualizar el árbitro con los datos nuevos, asignando correctamente el campeonato si es necesario
    await this.arbitroRepository.update(id, {
      ...updateArbitroDto,
      campeonato: campeonato ? { id: campeonato } : arbitroExistente.campeonato, // Solo actualiza campeonato si se pasa uno nuevo
    });
  
    // Obtener el árbitro actualizado
    const arbitroActualizado = await this.arbitroRepository.findOne({
      where: { id },
      relations: ['campeonato'], // Si necesitas devolver el campeonato actualizado
    });
  
    return arbitroActualizado;
  }

  async remove(id: number) {
    return await this.arbitroRepository.delete(id);
  }
}
