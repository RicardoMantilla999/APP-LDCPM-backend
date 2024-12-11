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



}
