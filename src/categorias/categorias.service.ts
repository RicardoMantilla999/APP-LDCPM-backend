import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { CreateCategoriaDto } from './dto/create-categoria.dto';
import { UpdateCategoriaDto } from './dto/update-categoria.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Categoria } from './entities/categoria.entity';
import { Repository } from 'typeorm';
import { Campeonato } from 'src/campeonatos/entities/campeonato.entity';

@Injectable()
export class CategoriasService {
  
  constructor(
    @InjectRepository(Categoria)
    private readonly categoriaRepository: Repository<Categoria>,
    @InjectRepository(Campeonato)
    private readonly campeonatoRepository: Repository<Campeonato>

  ){}

  async create(createCategoriaDto: CreateCategoriaDto) {
    const { categoria } = createCategoriaDto;

    // Verificar si ya existe una categoría con el mismo nombre
    const categoriaExistente = await this.categoriaRepository.findOne({
      where: { categoria },
    });

    if (categoriaExistente) {
      throw new BadRequestException('La categoría: '+categoriaExistente.categoria+ ' ya existe.' );
    }
    const campeonato = await this.campeonatoRepository.findOneBy(
      {id: createCategoriaDto.campeonato}
    )
    if (!campeonato) {
      throw new NotFoundException('Campeonato no encontrado')
    }

    const categoriaN = this.categoriaRepository.create({...createCategoriaDto, campeonato})

    // Crear y guardar la nueva categoría
    
    return await this.categoriaRepository.save(categoriaN);
  
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
    // Desestructuramos el DTO
    const { campeonato: campeonatoId, ...restoDatos } = updateCategoriaDto;
  
    // Verificamos si el campeonato existe
    const campeonato = await this.campeonatoRepository.findOneBy({ id: campeonatoId });
    if (!campeonato) {
      throw new NotFoundException('Campeonato no encontrado');
    }
  
    // Verificamos si la categoría existe
    const categoria = await this.categoriaRepository.findOneBy({ id });
    if (!categoria) {
      throw new NotFoundException('Categoría no encontrada');
    }
  
    // Actualizamos la categoría
    const datosActualizados = { ...restoDatos, campeonato }; // Incluye el campeonato relacionado
    
    return await this.categoriaRepository.save(datosActualizados);
  }

  async remove(id: number) {
    return await this.categoriaRepository.delete(id);
  }
}
