import { BadRequestException, ConflictException, Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { CreateJugadoreDto } from './dto/create-jugadore.dto';
import { UpdateJugadoreDto } from './dto/update-jugadore.dto';
import { Jugador } from './entities/jugador.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Equipo } from 'src/equipos/entities/equipo.entity';
import * as XLSX from 'xlsx';
import { Campeonato } from 'src/campeonatos/entities/campeonato.entity';
import { Gole } from 'src/goles/entities/gole.entity';
import { Tarjeta } from 'src/tarjetas/entities/tarjeta.entity';
import { TipoTarjeta } from 'src/common/enums/tarjetas.enum';
import { OrigenJugador } from 'src/common/enums/origen.enum';
import { CloudinaryService, } from 'src/common/cloudinary/cloudinary.service';



interface JugadorExcelRow {
  cedula: string;
  nombres: string;
  apellidos: string;
  dorsal: number;
  fecha_nacimiento: string | Date;
  canton_juega: string;
  direccion: string;
  telefono: string;
  email: string;
  equipo: string;
  origen: string;
  foto?: string;
}



@Injectable()
export class JugadoresService {

  constructor(
    @InjectRepository(Jugador)
    private readonly jugadorRepository: Repository<Jugador>,
    @InjectRepository(Gole)
    private readonly golRepository: Repository<Gole>,
    @InjectRepository(Tarjeta)
    private readonly tarjetaRepository: Repository<Tarjeta>,
    @InjectRepository(Equipo)
    private readonly equipoRepository: Repository<Equipo>,
    @InjectRepository(Campeonato)
    private readonly campeonatoRepository: Repository<Campeonato>,
    private readonly cloudinaryService: CloudinaryService,
  ) { }


  async create(createJugadorDto: CreateJugadoreDto, file?: Express.Multer.File): Promise<Jugador> {
    const { equipo, dorsal, cedula, apellidos, ...rest } = createJugadorDto;

    const equipoId = Number(equipo);
    const dorsalNumber = Number(dorsal);

    if (isNaN(equipoId) || isNaN(dorsalNumber)) {
      throw new BadRequestException('El equipo o el dorsal no son valores numéricos válidos.');
    }

    // **📌 OBTENER INFORMACIÓN DEL EQUIPO Y RELACIONES**
    const equipoData = await this.equipoRepository.findOne({
      where: { id: equipoId },
      relations: ['categoria', 'categoria.campeonato'],
    });

    if (!equipoData) {
      throw new NotFoundException(`No se encontró el equipo con ID ${equipoId}`);
    }

    const campeonatoId = equipoData.categoria?.campeonato?.id;
    const categoriaId = equipoData.categoria?.id;
    const nombreEquipo = equipoData.nombre;

    if (!campeonatoId || !categoriaId || !nombreEquipo) {
      throw new InternalServerErrorException('Faltan datos para la estructura de carpetas.');
    }

    // **📌 VERIFICAR SI EL DORSAL YA EXISTE EN EL EQUIPO**
    const existingDorsal = await this.jugadorRepository.findOne({
      where: { dorsal: dorsalNumber, equipo: { id: equipoId } },
    });
    if (existingDorsal) {
      throw new ConflictException(`El dorsal ${dorsalNumber} ya está asignado en el equipo ${nombreEquipo}.`);
    }

    // **📌 VERIFICAR SI LA CÉDULA YA EXISTE EN EL CAMPEONATO**
    const existingCedula = await this.jugadorRepository
      .createQueryBuilder('jugador')
      .innerJoin('jugador.equipo', 'equipo')
      .innerJoin('equipo.categoria', 'categoria')
      .innerJoin('categoria.campeonato', 'campeonato')
      .where('jugador.cedula = :cedula', { cedula })
      .andWhere('campeonato.id = :campeonatoId', { campeonatoId })
      .getOne();
    if (existingCedula) {
      throw new ConflictException(`La cédula ${cedula} ya está registrada en el campeonato.`);
    }

    // **📌 SUBIR IMAGEN A CLOUDINARY SI SE PROPORCIONA**
    let fotoUrl: string | undefined;
    if (file) {
      const folderPath = `campeonatos/${campeonatoId}/categorias/${categoriaId}/equipos/${nombreEquipo}`;
      const cloudinaryResponse = await this.cloudinaryService.uploadImage(file, folderPath);

      if (!cloudinaryResponse.secure_url) {
        throw new InternalServerErrorException('Error al obtener la URL de la imagen subida.');
      }

      fotoUrl = cloudinaryResponse.secure_url;
    }

    // **📌 CREAR EL JUGADOR Y GUARDARLO EN LA BASE DE DATOS**
    const jugador = this.jugadorRepository.create({
      ...rest,
      cedula,
      dorsal: dorsalNumber,
      apellidos,
      equipo: { id: equipoId },
      foto: fotoUrl, // **URL de la imagen en Cloudinary**
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
    return await this.jugadorRepository.findOne({ where: { id }, relations: ['equipo'] });
  }

  async update(id: number, updateJugadorDto: UpdateJugadoreDto, file?: Express.Multer.File): Promise<Jugador> {
    const jugador = await this.jugadorRepository.findOne({
      where: { id },
      relations: ['equipo', 'equipo.categoria', 'equipo.categoria.campeonato'],
    });

    if (!jugador) {
      throw new NotFoundException(`Jugador con ID ${id} no encontrado`);
    }

    // **📌 ASIGNAR LOS NUEVOS VALORES DEL DTO AL JUGADOR**
    Object.assign(jugador, updateJugadorDto);

    // **📌 VALIDAR SI SE ACTUALIZA EL EQUIPO**
    if (updateJugadorDto.equipo) {
      const equipo = await this.equipoRepository.findOne({ where: { id: updateJugadorDto.equipo } });
      if (!equipo) {
        throw new NotFoundException(`Equipo con ID ${updateJugadorDto.equipo} no encontrado`);
      }
      jugador.equipo = equipo;
    }

    // **📌 GESTIONAR IMAGEN EN CLOUDINARY**
    if (file) {
      // **🗑️ ELIMINAR LA IMAGEN ANTERIOR SI EXISTE**
      if (jugador.foto) {
        const publicId = this.extractPublicId(jugador.foto);
        await this.cloudinaryService.deleteImage(publicId);
      }

      // **📤 SUBIR LA NUEVA IMAGEN**
      const campeonatoId = jugador.equipo.categoria.campeonato.id;
      const categoriaId = jugador.equipo.categoria.id;
      const nombreEquipo = jugador.equipo.nombre;

      const folderPath = `campeonatos/${campeonatoId}/categorias/${categoriaId}/equipos/${nombreEquipo}`;

      // 📌 **Obtener la URL segura de la imagen desde Cloudinary**
      const uploadResponse = await this.cloudinaryService.uploadImage(file, folderPath);

      if (uploadResponse && uploadResponse.secure_url) {
        jugador.foto = uploadResponse.secure_url; // **Guardar solo la URL segura**
      }
    }

    return await this.jugadorRepository.save(jugador);
  }


  // Método auxiliar para obtener el public_id de una imagen de Cloudinary
  private extractPublicId(imageUrl: string): string {
    const parts = imageUrl.split('/');
    const filename = parts.pop()?.split('.')[0]; // Elimina la extensión
    return `${parts.pop()}/${filename}`;
  }


  async remove(id: number): Promise<void> {
    // **🔍 Buscar al jugador antes de eliminarlo**
    const jugador = await this.jugadorRepository.findOne({ where: { id } });

    if (!jugador) {
      throw new NotFoundException(`Jugador con ID ${id} no encontrado`);
    }

    // **🗑️ Eliminar la imagen en Cloudinary si existe**
    if (jugador.foto) {
      const publicId = this.extractPublicId(jugador.foto);
      await this.cloudinaryService.deleteImage(publicId);
    }

    // **🗑️ Eliminar el jugador de la base de datos**
    await this.jugadorRepository.delete(id);
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


  async obtenerHistorialPorCedula(cedula: string): Promise<HistorialJugador[]> {
    // 1. Buscar al jugador por cédula con las relaciones necesarias
    const jugador = await this.jugadorRepository.findOne({
      where: { cedula },
      relations: ['equipo', 'equipo.categoria', 'equipo.campeonato'],
    });

    if (!jugador) {
      throw new NotFoundException('No se encontró un jugador con la cédula especificada.');
    }

    const equipo = jugador.equipo;
    if (!equipo || !equipo.campeonato) {
      throw new Error('El jugador no está asociado a un equipo o campeonato válido.');
    }

    // 2. Buscar los goles del jugador
    const goles = await this.golRepository.find({
      where: { jugador: { id: jugador.id } },
      relations: ['jugador', 'jugador.equipo', 'jugador.equipo.campeonato'],
    });

    // 3. Buscar las tarjetas del jugador
    const tarjetas = await this.tarjetaRepository.find({
      where: { jugador: { id: jugador.id } },
      relations: ['jugador', 'jugador.equipo', 'jugador.equipo.campeonato'],
    });

    // 4. Construir el historial con la información solicitada
    const historial: Record<number, HistorialJugador> = {};

    goles.forEach((gol) => {
      const campeonato = gol.jugador.equipo.campeonato;
      const temporada = new Date(campeonato.fecha_inicio).getFullYear();
      const registro = historial[temporada] || {
        temporada,
        nombres: jugador.nombres,
        apellidos: jugador.apellidos,
        equipo: gol.jugador.equipo.nombre,
        categoria: gol.jugador.equipo.categoria.categoria,
        goles: 0,
        amarillas: 0,
        rojas: 0,
      };

      registro.goles += gol.goles || 0;
      historial[temporada] = registro;
    });

    tarjetas.forEach((tarjeta) => {
      const campeonato = tarjeta.jugador.equipo.campeonato;
      const temporada = new Date(campeonato.fecha_inicio).getFullYear();
      if (!historial[temporada]) {
        historial[temporada] = {
          temporada,
          nombres: jugador.nombres,
          apellidos: jugador.apellidos,
          equipo: tarjeta.jugador.equipo.nombre,
          categoria: tarjeta.jugador.equipo.categoria.categoria,
          goles: 0,
          amarillas: 0,
          rojas: 0,
        };
      }

      if (tarjeta.tipo === TipoTarjeta.Amarilla) historial[temporada].amarillas++;
      if (tarjeta.tipo === TipoTarjeta.Roja) historial[temporada].rojas++;
    });

    // 5. Retornar el historial ordenado por temporada
    return Object.values(historial).sort((a, b) => b.temporada - a.temporada);
  }




  async obtenerHistorialTodosLosJugadores(): Promise<HistorialJugador[]> {
    const jugadores = await this.jugadorRepository.find({
      relations: ['equipo', 'equipo.categoria', 'equipo.campeonato'],
    });

    const historial: Record<number, HistorialJugador> = {};

    for (const jugador of jugadores) {
      // Validar datos del jugador
      if (!jugador.id || isNaN(jugador.id)) {
        console.error(`Jugador inválido: ${JSON.stringify(jugador)}`);
        continue; // Ignorar jugadores con datos inválidos
      }

      const equipo = jugador.equipo;
      if (!equipo || !equipo.campeonato) {
        console.error(`El jugador con ID=${jugador.id} no tiene equipo o campeonato válido.`);
        continue;
      }

      const goles = await this.golRepository.find({
        where: { jugador: { id: jugador.id } },
        relations: ['jugador', 'jugador.equipo', 'jugador.equipo.campeonato'],
      });

      const tarjetas = await this.tarjetaRepository.find({
        where: { jugador: { id: jugador.id } },
        relations: ['jugador', 'jugador.equipo', 'jugador.equipo.campeonato'],
      });

      goles.forEach((gol) => {
        const temporada = new Date(equipo.campeonato.fecha_inicio).getFullYear();
        if (!historial[temporada]) {
          historial[temporada] = {
            temporada,
            nombres: jugador.nombres,
            apellidos: jugador.apellidos,
            equipo: equipo.nombre,
            categoria: equipo.categoria.categoria,
            goles: 0,
            amarillas: 0,
            rojas: 0,
          };
        }
        historial[temporada].goles += gol.goles || 0;
      });

      tarjetas.forEach((tarjeta) => {
        const temporada = new Date(equipo.campeonato.fecha_inicio).getFullYear();
        if (!historial[temporada]) {
          historial[temporada] = {
            temporada,
            nombres: jugador.nombres,
            apellidos: jugador.apellidos,
            equipo: equipo.nombre,
            categoria: equipo.categoria.categoria,
            goles: 0,
            amarillas: 0,
            rojas: 0,
          };
        }
        if (tarjeta.tipo === TipoTarjeta.Amarilla) historial[temporada].amarillas++;
        if (tarjeta.tipo === TipoTarjeta.Roja) historial[temporada].rojas++;
      });
    }

    return Object.values(historial).sort((a, b) => b.temporada - a.temporada);
  }


  async importarJugadores(file: Express.Multer.File, equipoId: number): Promise<{ message: string; ignorados: string[] }> {
    // Leer el archivo Excel
    const workbook = XLSX.read(file.buffer, { type: 'buffer' });
    const sheet = workbook.Sheets[workbook.SheetNames[0]];
    const data: JugadorExcelRow[] = XLSX.utils.sheet_to_json(sheet);

    // Filtrar filas vacías o mal formateadas
    const filasValidas = data.filter(row => {
      return (
        String(row.nombres)?.trim() &&
        String(row.apellidos)?.trim() &&
        String(row.cedula)?.trim()
      );
    });

    if (filasValidas.length === 0) {
      throw new Error("No hay datos válidos para importar.");
    }

    // Verificar si el equipo existe
    const equipo = await this.equipoRepository.findOne({ where: { id: equipoId }, relations: ['categoria', 'campeonato'] });
    if (!equipo) {
      throw new Error(`Equipo no encontrado: ID ${equipoId}`);
    }

    const categoriaId = equipo.categoria.id; // Obtener categoría del equipo
    const campeonatoId = equipo.campeonato.id; // Obtener campeonato del equipo

    const ignorados: string[] = []; // Lista para almacenar las cédulas ignoradas

    // Validar y filtrar jugadores que ya existen
    const jugadores = [];
    for (const row of filasValidas) {
      const existeJugador = await this.jugadorRepository.findOne({
        where: {
          cedula: row.cedula,
          equipo: {
            id: equipoId,
            categoria: { id: categoriaId },
            campeonato: { id: campeonatoId },
          },
        },
        relations: ['equipo', 'equipo.categoria', 'equipo.campeonato'],
      });

      if (existeJugador) {
        // Si el jugador ya existe, agregarlo a la lista de ignorados
        ignorados.push(row.cedula);
      } else {
        // Si no existe, crearlo
        jugadores.push(
          this.jugadorRepository.create({
            cedula: row.cedula,
            nombres: String(row.nombres).toUpperCase(),
            apellidos: String(row.apellidos).toUpperCase(),
            fecha_nacimiento: row.fecha_nacimiento ? new Date(row.fecha_nacimiento) : null,
            canton_juega: row.canton_juega ? String(row.canton_juega).toUpperCase() : null,
            direccion: row.direccion ? String(row.direccion).toUpperCase() : null,
            telefono: row.telefono,
            email: row.email,
            origen: OrigenJugador.Nacional,
            equipo,
            foto: row.foto || null,
          })
        );
      }
    }

    // Guardar los jugadores que no se repiten
    if (jugadores.length > 0) {
      await this.jugadorRepository.save(jugadores);
    }

    // Mensaje final con detalles de los ignorados
    return {
      message: `Jugadores importados exitosamente. Ignorados: ${ignorados.length}`,
      ignorados,
    };
  }



}
