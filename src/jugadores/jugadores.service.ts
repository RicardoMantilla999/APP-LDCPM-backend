import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { CreateJugadoreDto } from './dto/create-jugadore.dto';
import { UpdateJugadoreDto } from './dto/update-jugadore.dto';
import { Jugador } from './entities/jugador.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Equipo } from 'src/equipos/entities/equipo.entity';
import e from 'express';
import { createFolderStructure, generateFileName } from './helpers/file.helper';
import * as path from 'path';
import * as fs from 'fs';
import { Campeonato } from 'src/campeonatos/entities/campeonato.entity';


@Injectable()
export class JugadoresService {

  constructor(
    @InjectRepository(Jugador)
    private readonly jugadorRepository: Repository<Jugador>,
    @InjectRepository(Equipo)
    private readonly equipoRepository: Repository<Equipo>,
  ) { }


  async create(createJugadorDto: CreateJugadoreDto, file?: Express.Multer.File): Promise<Jugador> {
    const { equipo, dorsal, cedula, apellidos, ...rest } = createJugadorDto;
    const mediaBasePath = path.resolve(__dirname, '..', '..', 'media'); // Ruta absoluta a la carpeta "media"

    // Conversión a números
    const equipoId = Number(equipo);
    const dorsalNumber = Number(dorsal);

    if (isNaN(equipoId) || isNaN(dorsalNumber)) {
      throw new Error('El equipo o el dorsal no son valores numéricos válidos.');
    }

    // Consulta del equipo y sus relaciones (campeonato y categoría)
    const equipoData = await this.equipoRepository.findOne({
      where: { id: equipoId },
      relations: ['categoria', 'categoria.campeonato'],
    });

    if (!equipoData) {
      throw new Error(`No se encontró el equipo con ID ${equipoId}`);
    }

    const campeonatoId = equipoData.categoria?.campeonato?.id;
    const categoriaId = equipoData.categoria?.id;
    const nombreEquipo = equipoData.nombre;

    if (!campeonatoId || !categoriaId || !nombreEquipo) {
      throw new Error('Faltan datos para crear la estructura de carpetas (campeonato, categoría o equipo).');
    }

    // Validación: Verificar si el dorsal ya existe en el equipo
    const existingDorsal = await this.jugadorRepository.findOne({
      where: { dorsal: dorsalNumber, equipo: { id: equipoId } },
    });
    if (existingDorsal) {
      throw new Error(`El dorsal ${dorsalNumber} ya está asignado a otro jugador en el equipo ${nombreEquipo}.`);
    }

    // Validación: Verificar si la cédula ya existe en el mismo campeonato
    const existingCedula = await this.jugadorRepository
      .createQueryBuilder('jugador')
      .innerJoin('jugador.equipo', 'equipo')
      .innerJoin('equipo.categoria', 'categoria')
      .innerJoin('categoria.campeonato', 'campeonato')
      .where('jugador.cedula = :cedula', { cedula })
      .andWhere('campeonato.id = :campeonatoId', { campeonatoId })
      .getOne();
    if (existingCedula) {
      throw new Error(`La cédula ${cedula} ya está registrada en el campeonato.`);
    }

    // Creación de la ruta de la foto
    let fotoPath: string | undefined = undefined;
    if (file) {
      const folderPath = createFolderStructure(campeonatoId, categoriaId, nombreEquipo);

      if (!folderPath) {
        throw new Error('No se pudo crear la estructura de carpetas.');
      }

      const fileName = generateFileName(dorsalNumber, apellidos);
      if (!fileName) {
        throw new Error('No se pudo generar el nombre del archivo.');
      }

      const absoluteFotoPath = path.join(folderPath, fileName);
      fs.writeFileSync(absoluteFotoPath, file.buffer);

      // Generar la ruta relativa solo desde "media"
      fotoPath = path.relative(mediaBasePath, absoluteFotoPath).replace(/\\/g, '/'); // Asegura el formato UNIX
    }

    // Creación del jugador
    const jugador = this.jugadorRepository.create({
      ...rest,
      cedula,
      dorsal: dorsalNumber,
      apellidos,
      equipo: { id: equipoId },
      foto: fotoPath, // Guarda la ruta relativa desde "media"
    });

    return this.jugadorRepository.save(jugador);
  }




  async findAll(id: number) {
    return await this.jugadorRepository.find({ where: { equipo: { campeonato: { id: id } } } });
  }

  async contarJugadores(campeonatoId: number) {
    const count = await this.jugadorRepository.count({ where: { equipo: { campeonato: { id: campeonatoId } } } });
    return count;
  }

  async findOne(id: number) {
    return await this.jugadorRepository.findOneBy({ id });
  }

  async update(id: number, updateJugadorDto: UpdateJugadoreDto) {
    const jugador = await this.jugadorRepository.findOne({ where: { id } });

    if (!jugador) {
      throw new NotFoundException(`Jugador con ID ${id} No encontrado`);
    }
    Object.assign(jugador, updateJugadorDto);
    // Si hay una categoría, podrías validar y asignarla
    if (updateJugadorDto.equipo) {
      const equipo = await this.equipoRepository.findOne({
        where: { id: updateJugadorDto.equipo },
      });
      if (!equipo) {
        throw new NotFoundException(`Equipo con ID ${updateJugadorDto.equipo} No encontrado`);
      }
      jugador.equipo = equipo;
    }
    return await this.jugadorRepository.save(jugador);
  }

  async remove(id: number) {
    return await this.jugadorRepository.delete(id);
  }

  async filtrarJugadoresByEquipo(equipoId: number): Promise<Jugador[]> {
    return this.jugadorRepository.find({
      where: { equipo: { id: equipoId } }, // Filtra por equipo ID
      relations: ['equipo'], // Incluye la relación con el equipo
    });
  }

  async getDynamicPath(equipoId: number): Promise<string> {
    const equipo = await this.equipoRepository.findOne({
      where: { id: equipoId },
      relations: ['campeonato', 'categoria'],
    });

    if (!equipo) {
      throw new NotFoundException('Equipo no encontrado');
    }

    const campeonatoID = equipo.campeonato.id;
    const categoriaID = equipo.categoria.id;
    const equipoNombre = equipo.nombre.replace(/\s+/g, '-');

    // Ruta dinámica
    return `./media/${campeonatoID}/${categoriaID}/${equipoNombre}/jugadores`;
  }






}
