import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { CreatePosicioneDto } from './dto/create-posicione.dto';
import { UpdatePosicioneDto } from './dto/update-posicione.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Posicione } from './entities/posicione.entity';
import { Repository } from 'typeorm';
import { Partido } from 'src/partidos/entities/partido.entity';

@Injectable()
export class PosicionesService {

  constructor(
    @InjectRepository(Posicione)
    private readonly posicionRepository: Repository<Posicione>,
    @InjectRepository(Partido)
    private readonly partidoRepository: Repository<Partido>,
  ) { }

  create(createPosicioneDto: CreatePosicioneDto) {
    return 'This action adds a new posicione';
  }

  findAll() {
    return `This action returns all posiciones`;
  }

  findOne(id: number) {
    return `This action returns a #${id} posicione`;
  }

  update(id: number, updatePosicioneDto: UpdatePosicioneDto) {
    return `This action updates a #${id} posicione`;
  }

  remove(id: number) {
    return `This action removes a #${id} posicione`;
  }




  async actualizarTablaPosiciones(partidoId: number) {
    // Obtener el partido y sus resultados
    const partido = await this.partidoRepository.findOne({
        where: { id: partidoId },
        relations: ['equipo_1', 'equipo_2'], // Aseguramos traer los equipos relacionados
    });

    if (!partido) {
        throw new NotFoundException('Partido no encontrado');
    }

    // Actualizar posición del equipo 1
    const posicionEquipo1 = await this.posicionRepository.findOne({
        where: { equipo: { id: partido.equipo_1.id } },
    });

    if (posicionEquipo1) {
        posicionEquipo1.partidosJugados += 1;
        posicionEquipo1.golesFavor += partido.goles_1;
        posicionEquipo1.golesContra += partido.goles_2;
        posicionEquipo1.diferenciaGoles += partido.goles_1 - partido.goles_2;

        if (partido.goles_1 > partido.goles_2) {
            posicionEquipo1.puntos += 3; // Victoria
            posicionEquipo1.partidosGanados += 1; // Incrementa partidos ganados
        } else if (partido.goles_1 === partido.goles_2) {
            posicionEquipo1.puntos += 1; // Empate
            posicionEquipo1.partidosEmpatados += 1; // Incrementa partidos empatados
        } else {
            posicionEquipo1.partidosPerdidos += 1; // Incrementa partidos perdidos
        }

        await this.posicionRepository.save(posicionEquipo1);
    }

    // Actualizar posición del equipo 2
    const posicionEquipo2 = await this.posicionRepository.findOne({
        where: { equipo: { id: partido.equipo_2.id } },
    });

    if (posicionEquipo2) {
        posicionEquipo2.partidosJugados += 1;
        posicionEquipo2.golesFavor += partido.goles_2;
        posicionEquipo2.golesContra += partido.goles_1;
        posicionEquipo2.diferenciaGoles += partido.goles_2 - partido.goles_1;

        if (partido.goles_2 > partido.goles_1) {
            posicionEquipo2.puntos += 3; // Victoria
            posicionEquipo2.partidosGanados += 1; // Incrementa partidos ganados
        } else if (partido.goles_2 === partido.goles_1) {
            posicionEquipo2.puntos += 1; // Empate
            posicionEquipo2.partidosEmpatados += 1; // Incrementa partidos empatados
        } else {
            posicionEquipo2.partidosPerdidos += 1; // Incrementa partidos perdidos
        }

        await this.posicionRepository.save(posicionEquipo2);
    }
}


  async obtenerPosiciones(categoriaId: number, faseId: number): Promise<Posicione[]> {
    return this.posicionRepository.find({
      where: {
        categoria: { id: categoriaId },
        fase: { id: faseId },
      },
      relations: ['equipo', 'categoria', 'fase'],
      order: { puntos: 'DESC', diferenciaGoles: 'DESC' },
    });
  }



}
