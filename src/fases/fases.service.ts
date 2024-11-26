import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { CreateFaseDto } from './dto/create-fase.dto';
import { UpdateFaseDto } from './dto/update-fase.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Fase } from './entities/fase.entity';
import { Repository } from 'typeorm';
import { Campeonato } from 'src/campeonatos/entities/campeonato.entity';

@Injectable()
export class FasesService {

  constructor(
    @InjectRepository(Fase)
    private readonly faseRepository: Repository<Fase>,
    @InjectRepository(Campeonato)
    private readonly campeonatoRepository: Repository<Campeonato>
  ){}


  async create(createFaseDto: CreateFaseDto) {
    console.log('DTO recibido:', createFaseDto);

    const campeonato = await this.campeonatoRepository.findOne({ where: { id: createFaseDto.campeonato } });
    console.log('Campeonato encontrado:', campeonato);

    if (!campeonato) {
        console.error('Campeonato no encontrado');
        throw new NotFoundException('Campeonato no encontrado');
    }

    // Asignar manualmente las propiedades necesarias
    const nuevaFase = this.faseRepository.create({
        nombre: createFaseDto.nombre,
        orden: createFaseDto.orden,
        campeonato: campeonato,
    });
    console.log('Fase creada:', nuevaFase);

    const resultado = await this.faseRepository.save(nuevaFase);
    console.log('Resultado guardado:', resultado);

    return resultado;
}



   async findAll() {
    return await this.faseRepository.find();
  }

  async findOne(id: number) {
    return await this.faseRepository.findOneBy({id});
  }

  async update(id: number, updateFaseDto: UpdateFaseDto) {
    const fase = await this.faseRepository.findOne({
      where: { id },
      relations: ['campeonato'], // Asegúrate de cargar la relación existente
    });
  
    if (!fase) {
      throw new NotFoundException('Fase no encontrada');
    }
  
    // Verificar y actualizar el campeonato si está presente en el DTO
    if (updateFaseDto.campeonato) {
      const campeonato = await this.campeonatoRepository.findOne({
        where: { id: updateFaseDto.campeonato },
      });
  
      if (!campeonato) {
        throw new NotFoundException('Campeonato no encontrado');
      }
  
      fase.campeonato = campeonato;
    }
  
    // Actualizar otras propiedades
    Object.assign(fase, updateFaseDto);
  
    console.log('Fase a guardar:', fase);
  
    // Usar save para manejar tanto relaciones como columnas
    return await this.faseRepository.save(fase);
  }
  
  

  async remove(id: number) {
    return await this.faseRepository.delete(id);
  }
}
