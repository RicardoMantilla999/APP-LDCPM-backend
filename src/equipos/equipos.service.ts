import { BadRequestException, Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { CreateEquipoDto } from './dto/create-equipo.dto';
import { UpdateEquipoDto } from './dto/update-equipo.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Equipo } from './entities/equipo.entity';
import { Repository } from 'typeorm';
import { Categoria } from 'src/categorias/entities/categoria.entity';
import { Dirigente } from 'src/dirigentes/entities/dirigente.entity';
import { Campeonato } from 'src/campeonatos/entities/campeonato.entity';
import { Posicione } from 'src/posiciones/entities/posicione.entity';
import { Fase } from 'src/fases/entities/fase.entity';
import { CloudinaryService } from 'src/common/cloudinary/cloudinary.service';
import * as Express from 'express';


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
    private readonly campeonatoRepository: Repository<Campeonato>,
    @InjectRepository(Posicione)
    private readonly posicionesRepository: Repository<Posicione>,
    @InjectRepository(Fase)
    private readonly faseRepository: Repository<Fase>,
    private readonly cloudinaryService: CloudinaryService,
  ) { }

  async create(createEquipoDto: CreateEquipoDto, logoUrl: string) {
    // 🔹 Verificar si la categoría existe
    const categoria = await this.categoriaRepository.findOneBy({ id: createEquipoDto.categoria });
    if (!categoria) {
      throw new NotFoundException('Categoría no encontrada');
    }

    // 🔹 Verificar si el dirigente existe
    const dirigente = await this.dirigenteRepository.findOne({ where: { id: createEquipoDto.dirigente } });
    if (!dirigente) {
      throw new NotFoundException('Dirigente no encontrado');
    }

    // 🔹 Verificar si el campeonato existe
    const campeonato = await this.campeonatoRepository.findOne({ where: { id: createEquipoDto.campeonato } });
    if (!campeonato) {
      throw new NotFoundException('Campeonato no encontrado');
    }

    // 🔹 Verificar la fase actual
    const faseActual = await this.faseRepository.findOneBy({ orden: 0 });
    if (!faseActual) {
      throw new NotFoundException('Fase actual no encontrada');
    }

    // 🔹 Buscar la siguiente fase
    const siguienteFase = await this.faseRepository.findOne({ where: { orden: faseActual.orden + 1 } });
    if (!siguienteFase) {
      throw new Error('No se encontró la siguiente fase.');
    }

    // 🔹 Verificar si ya existe un equipo con el mismo nombre en la categoría y campeonato
    const equipoExistente = await this.equipoRepository.findOne({
      where: {
        nombre: createEquipoDto.nombre,
        categoria: { id: createEquipoDto.categoria },
        campeonato: { id: createEquipoDto.campeonato },
      },
      relations: ['categoria', 'campeonato'],
    });

    if (equipoExistente) {
      throw new BadRequestException(`El equipo ${createEquipoDto.nombre} ya existe en la categoría ${categoria.categoria}.`);
    }

    // ✅ **Crear y guardar el nuevo equipo**
    const equipo = this.equipoRepository.create({
      ...createEquipoDto,
      categoria: { id: categoria.id },
      dirigente: { id: dirigente.id },
      campeonato: { id: campeonato.id },
      fase_actual: { id: faseActual.id },
      logo: logoUrl, // ✅ Guardamos la URL del logo (viene desde el Controller)
    });

    const nuevoEquipo = await this.equipoRepository.save(equipo);

    // ✅ **Crear el registro en la tabla de posiciones**
    const nuevaPosicion = this.posicionesRepository.create({
      equipo: nuevoEquipo,
      puntos: 0,
      golesFavor: 0,
      golesContra: 0,
      diferenciaGoles: 0,
      categoria: categoria,
      fase: siguienteFase
    });

    await this.posicionesRepository.save(nuevaPosicion);

    return nuevoEquipo;
  }






  async findAll(idCampeonato: number) {
    return await this.equipoRepository.findBy({
      campeonato: { id: idCampeonato },
      // Relación con la categoría
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
      order: { nombre: 'ASC' }, // Ordenar por nombre de equipo
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
      .orderBy('equipo.nombre', 'ASC')
      .getMany();
  }



  async findOne(id: number) {
    return this.equipoRepository.findOne({
      where: { id },
      relations: ['categoria', 'dirigente'], // Asegúrate de incluir las relaciones
      order: { nombre: 'ASC' }, // Ordenar por nombre de equipo
    });
  }


  async update(id: number, updateEquipoDto: UpdateEquipoDto, file?: Express.Multer.File): Promise<Equipo> {
    const equipo = await this.equipoRepository.findOne({ where: { id } });
  
    if (!equipo) {
      throw new NotFoundException(`Equipo con ID ${id} no encontrado`);
    }
  
    // **📌 ELIMINAR LOGO ANTERIOR SI EXISTE Y SE RECIBE UNO NUEVO**
    if (file && equipo.logo) {
      const publicId = this.cloudinaryService.extractPublicId(equipo.logo); // Extraer el public_id
      await this.cloudinaryService.deleteImage(publicId);
      console.log(`🗑️ Imagen anterior eliminada de Cloudinary: ${publicId}`);
    }
  
    // **📌 SUBIR NUEVO LOGO SI SE PROPORCIONA**
    if (file) {
      const folderPath = `campeonatos/${equipo.campeonato.id}/categorias/${equipo.categoria.id}/equipos`;
      const cloudinaryResponse = await this.cloudinaryService.uploadImage(file, folderPath);
  
      if (!cloudinaryResponse.secure_url) {
        throw new InternalServerErrorException('No se pudo obtener la URL de la imagen subida.');
      }
      equipo.logo = cloudinaryResponse.secure_url;
    }
  
    // **Actualizar las propiedades del equipo**
    Object.assign(equipo, updateEquipoDto);
  
    return await this.equipoRepository.save(equipo);
  }
  






  async remove(id: number): Promise<void> {
    // **📌 OBTENER EL EQUIPO**
    const equipo = await this.equipoRepository.findOne({ where: { id } });

    if (!equipo) {
      throw new NotFoundException(`Equipo con ID ${id} no encontrado`);
    }

    // **📌 ELIMINAR LOGO EN CLOUDINARY SI EXISTE**
    if (equipo.logo) {
      const publicId = this.cloudinaryService.extractPublicId(equipo.logo); // Extraer el public_id
      await this.cloudinaryService.deleteImage(publicId);
      console.log(`🗑️ Imagen eliminada de Cloudinary: ${publicId}`);
    }

    // **📌 ELIMINAR POSICIONES RELACIONADAS**
    await this.posicionesRepository.delete({ equipo: { id } });

    // **📌 ELIMINAR EQUIPO**
    await this.equipoRepository.delete({ id });
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
      order: { nombre: 'ASC' }, // Ordenar por nombre de equipo
    });
  }

  async getEquiposByCategoriaAndCampeonato(categoriaId: number, campeonatoId: number) {
    return this.equipoRepository.find({
      where: { categoria: { id: categoriaId }, campeonato: { id: campeonatoId } },
      relations: ['categoria'], // Incluye la relación con la categoría
      order: { nombre: 'ASC' }, // Ordenar por nombre de equipo
    });
  }


  async getCampeonatoById(id: number): Promise<Campeonato> {
    const campeonato = await this.campeonatoRepository.findOne({ where: { id } });
    if (!campeonato) {
      throw new NotFoundException('Campeonato no encontrado');
    }
    return campeonato;
  }

  // Método para obtener la categoría por ID
  async getCategoriaById(id: number): Promise<Categoria> {
    const categoria = await this.categoriaRepository.findOne({ where: { id } });
    if (!categoria) {
      throw new NotFoundException('Categoría no encontrada');
    }
    return categoria;
  }


}
