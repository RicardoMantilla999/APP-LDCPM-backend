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

    // Asignar manualmente las propiedades necesarias
    const nuevaFase = this.faseRepository.create({
        nombre: createFaseDto.nombre,
        orden: createFaseDto.orden,
    });

    const resultado = await this.faseRepository.save(nuevaFase);

    return resultado;
}



   async findAll() {
    return await this.faseRepository.find({order: {orden: 'ASC'}});
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
