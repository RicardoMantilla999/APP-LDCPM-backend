import { BadRequestException, Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { CreateCategoriaDto } from './dto/create-categoria.dto';
import { UpdateCategoriaDto } from './dto/update-categoria.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Categoria } from './entities/categoria.entity';
import { Repository } from 'typeorm';
import { Campeonato } from 'src/campeonatos/entities/campeonato.entity';
import { Fase } from 'src/fases/entities/fase.entity';

@Injectable()
export class CategoriasService {
  
  constructor(
    @InjectRepository(Categoria)
    private readonly categoriaRepository: Repository<Categoria>,
    @InjectRepository(Campeonato)
    private readonly campeonatoRepository: Repository<Campeonato>,
    @InjectRepository(Fase)
    private readonly faseRepository: Repository<Fase>,

  ){}

  async create(createCategoriaDto: CreateCategoriaDto) {
    const { categoria, descripcion, fase_actual, campeonato: campeonatoId } = createCategoriaDto;
  
    // Verificar si ya existe una categoría con el mismo nombre en el campeonato
    const categoriaExistente = await this.categoriaRepository.findOne({
      where: { categoria, campeonato: { id: campeonatoId } },
      relations: ['campeonato'],
    });
  
    if (categoriaExistente) {
      throw new BadRequestException(
        `La categoría "${categoriaExistente.categoria}" ya existe en este campeonato.`
      );
    }
  
    // Verificar que el campeonato exista
    const campeonato = await this.campeonatoRepository.findOneBy({ id: campeonatoId });
    if (!campeonato) {
      throw new NotFoundException('Campeonato no encontrado.');
    }
  
    // Verificar que la fase actual exista
    let faseActual = null;
    if (fase_actual) {
      faseActual = await this.faseRepository.findOneBy({ id: fase_actual });
      if (!faseActual) {
        throw new BadRequestException('La fase actual seleccionada no existe.');
      }
    }
  
    // Crear la categoría con la fase actual y campeonato
    const nuevaCategoria = this.categoriaRepository.create({
      categoria,
      descripcion,
      campeonato,
      fase_actual: faseActual,
    });
  
    return await this.categoriaRepository.save(nuevaCategoria);
  }
  

  async findCategoriasByCampeonato(campeonatoId: number) {
    return await this.categoriaRepository.find({
      where: {
        campeonato: {
          id: campeonatoId,
        },
      },
      relations: ['campeonato'], // Opcional, incluye los datos del campeonato si es necesario
    });
  }
  
  async obtenerFaseActual(categoriaId: number): Promise<Fase> {
    try {
      // Busca la categoría con su fase actual
      const categoria = await this.categoriaRepository.findOne({
        where: { id: categoriaId },
        relations: ['fase_actual'],
      });
  
      if (!categoria) {
        throw new NotFoundException('Categoría no encontrada.');
      }
  
      if (!categoria.fase_actual) {
        throw new NotFoundException('La categoría no tiene una fase actual configurada.');
      }
  
      return categoria.fase_actual;
    } catch (error) {
      console.error('Error en obtenerFaseActual:', error.message, error.stack);
      throw new InternalServerErrorException('Error al obtener la fase actual de la categoría.');
    }
  }
  
  

  async findAll() {
    return await this.categoriaRepository.find();
  }

  async findOne(id: number) {
    return await this.categoriaRepository.findOneBy({id});
  }

  async contarCategorias(campeonatoIdid: number){
    const count = await this.categoriaRepository.count({where:{campeonato:{id: campeonatoIdid }}});
    return count;
  }


  async update(id: number, updateCategoriaDto: UpdateCategoriaDto) {
    const { categoria, descripcion, fase_actual } = updateCategoriaDto;
  
    // Verificar si la categoría existe
    const categoriaExistente = await this.categoriaRepository.findOne({
      where: { id },
      relations: ['campeonato', 'fase_actual'],
    });
  
    if (!categoriaExistente) {
      throw new NotFoundException('La categoría no fue encontrada.');
    }
  
    // Si se envió `fase_actual_id`, verificar que exista
    let faseActual = null;
    if (fase_actual) {
      faseActual = await this.faseRepository.findOneBy({ id: fase_actual });
      if (!faseActual) {
        throw new BadRequestException('La fase actual seleccionada no existe.');
      }
    }
  
    // Actualizar los campos de la categoría
    categoriaExistente.categoria = categoria ?? categoriaExistente.categoria;
    categoriaExistente.descripcion = descripcion ?? categoriaExistente.descripcion;
    categoriaExistente.fase_actual = faseActual || null;
  
    return await this.categoriaRepository.save(categoriaExistente);
  }
  

  async remove(id: number) {
    return await this.categoriaRepository.delete(id);
  }
}
