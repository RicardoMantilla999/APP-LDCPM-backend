import { Injectable } from '@nestjs/common';
import { CreateTarjetaDto } from './dto/create-tarjeta.dto';
import { UpdateTarjetaDto } from './dto/update-tarjeta.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Tarjeta } from './entities/tarjeta.entity';
import { Repository } from 'typeorm';
import { TipoTarjeta } from 'src/common/enums/tarjetas.enum';
import { Jugador } from 'src/jugadores/entities/jugador.entity';
import { Partido } from 'src/partidos/entities/partido.entity';
import { Equipo } from 'src/equipos/entities/equipo.entity';
import { Resultado } from '../tarjetas/tarjetas.interface';

@Injectable()
export class TarjetasService {


  constructor(
    @InjectRepository(Tarjeta)
    private readonly tarjetaRepository: Repository<Tarjeta>,
    @InjectRepository(Jugador)
    private readonly jugadorRepository: Repository<Jugador>,
    @InjectRepository(Partido)
    private readonly partidoRepository: Repository<Partido>,
    @InjectRepository(Equipo)
    private readonly equipoRepository: Repository<Equipo>,

  ) { }



  create(createTarjetaDto: CreateTarjetaDto) {
    return 'This action adds a new tarjeta';
  }

  findAll() {
    return `This action returns all tarjetas`;
  }

  findOne(id: number) {
    return `This action returns a #${id} tarjeta`;
  }

  update(id: number, updateTarjetaDto: UpdateTarjetaDto) {
    return `This action updates a #${id} tarjeta`;
  }

  remove(id: number) {
    return `This action removes a #${id} tarjeta`;
  }

  async guardarTarjeta(
    jugadorId: number,
    partidoId: number,
    equipoId: number,
    tipo: TipoTarjeta
  ): Promise<Tarjeta> {
    // Cargar las entidades correspondientes
    const jugador = await this.jugadorRepository.findOne({ where: { id: jugadorId } });
    const partido = await this.partidoRepository.findOne({ where: { id: partidoId } });
    const equipo = await this.equipoRepository.findOne({ where: { id: equipoId } });

    if (!jugador || !partido || !equipo) {
      throw new Error('No se encontraron las entidades correspondientes.');
    }

    // Crear la tarjeta con las relaciones completas
    const tarjeta = this.tarjetaRepository.create({
      tipo,
      jugador,
      partido,
      equipo,
    });

    // Guardar la tarjeta
    return await this.tarjetaRepository.save(tarjeta);
  }

  // En el servicio:
  async obtenerTarjetasPorPartido(partidoId: number): Promise<Tarjeta[]> {
    return this.tarjetaRepository.find({
      where: { partido: { id: partidoId } },
      relations: ['jugador', 'equipo'], // Si necesitas las relaciones
    });
  }




  async getTarjetasPorFechas(categoriaId: number, equipoId: number, faseId: number) {
    categoriaId = Number(categoriaId);
    equipoId = Number(equipoId);
    faseId = Number(faseId);

    // Validar parámetros
    if (isNaN(categoriaId) || isNaN(equipoId) || isNaN(faseId)) {
      throw new Error('Parámetros inválidos. Asegúrate de enviar números válidos.');
    }

    // Obtener las fechas de la fase
    const partidos = await this.partidoRepository
      .createQueryBuilder('partido')
      .where('partido.faseId = :faseId', { faseId })
      .orderBy('partido.nro_fecha', 'ASC')
      .getMany();

    const fechas = partidos.map((partido) => `Fecha ${partido.nro_fecha}`);

    // Obtener tarjetas
    const tarjetas = await this.tarjetaRepository
      .createQueryBuilder('tarjeta')
      .leftJoinAndSelect('tarjeta.jugador', 'jugador')
      .leftJoinAndSelect('tarjeta.partido', 'partido')
      .where('partido.categoriaId = :categoriaId', { categoriaId })
      .andWhere('tarjeta.equipoId = :equipoId', { equipoId })
      .andWhere('partido.faseId = :faseId', { faseId })
      .orderBy('jugador.id', 'ASC')
      .addOrderBy('partido.nro_fecha', 'ASC')
      .getMany();

    // Procesar tarjetas
    const resultado: Resultado = {};  // Define el tipo de resultado

    tarjetas.forEach((tarjeta) => {
      const jugadorId = tarjeta.jugador.id;
      if (!resultado[jugadorId]) {
        resultado[jugadorId] = {
          nombres: tarjeta.jugador.nombres,
          apellidos: tarjeta.jugador.apellidos,
          fechas: {},
        };
      }

      // Agregar la tarjeta a la fecha correspondiente
      const nroFecha = `Fecha ${tarjeta.partido.nro_fecha}`;
      resultado[jugadorId].fechas[nroFecha] = tarjeta.tipo || 'ST';
    });

    // Asegurarse de que todos los jugadores tengan una entrada para todas las fechas
    Object.values(resultado).forEach((jugador) => {
      fechas.forEach((fecha) => {
        if (!jugador.fechas[fecha]) {
          jugador.fechas[fecha] = 'ST';  // Si no tiene tarjeta, asignar "ST"
        }
      });
    });
    return resultado;
  }



  private async obtenerNumeroTotalDeFechas(faseId: number, categoriaId: number): Promise<number> {
    // Consulta para obtener el número total de fechas
    const result = await this.tarjetaRepository
      .createQueryBuilder('tarjeta')
      .leftJoin('tarjeta.partido', 'partido')
      .where('partido.faseId = :faseId', { faseId })
      .andWhere('partido.categoriaId = :categoriaId', { categoriaId })
      .select('MAX(partido.nro_fecha)', 'maxFecha')
      .getRawOne();

    return parseInt(result.maxFecha, 10) || 0;
  }


}
