import { Test, TestingModule } from '@nestjs/testing';
import { PosicionesService } from './posiciones.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Partido } from '../partidos/entities/partido.entity';
import { Posicione } from './entities/posicione.entity';
import { Repository } from 'typeorm';
import { NotFoundException } from '@nestjs/common';

describe('PosicionesService - actualizarTablaPosiciones()', () => {
  let service: PosicionesService;
  let partidoRepo: jest.Mocked<Repository<Partido>>;
  let posicionRepo: jest.Mocked<Repository<Posicione>>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        PosicionesService,
        {
          provide: getRepositoryToken(Partido),
          useValue: {
            findOne: jest.fn(),
          },
        },
        {
          provide: getRepositoryToken(Posicione),
          useValue: {
            findOne: jest.fn(),
            save: jest.fn(),
          },
        },
      ],
    }).compile();

    service = module.get<PosicionesService>(PosicionesService);
    partidoRepo = module.get(getRepositoryToken(Partido));
    posicionRepo = module.get(getRepositoryToken(Posicione));
  });

 

  it('debería actualizar correctamente las posiciones de ambos equipos', async () => {
    const mockPartido = {
      id: 1,
      goles_1: 2,
      goles_2: 1,
      equipo_1: { id: 1 },
      equipo_2: { id: 2 },
    };

    const mockPosicion1 = {
      equipo: { id: 1 },
      partidosJugados: 0,
      golesFavor: 0,
      golesContra: 0,
      diferenciaGoles: 0,
      puntos: 0,
      partidosGanados: 0,
      partidosEmpatados: 0,
      partidosPerdidos: 0,
    };

    const mockPosicion2 = {
      equipo: { id: 2 },
      partidosJugados: 0,
      golesFavor: 0,
      golesContra: 0,
      diferenciaGoles: 0,
      puntos: 0,
      partidosGanados: 0,
      partidosEmpatados: 0,
      partidosPerdidos: 0,
    };

    partidoRepo.findOne.mockResolvedValue(mockPartido as any);
    posicionRepo.findOne
      .mockResolvedValueOnce(mockPosicion1 as any)
      .mockResolvedValueOnce(mockPosicion2 as any);

    await service.actualizarTablaPosiciones(1);

    expect(posicionRepo.save).toHaveBeenCalledTimes(2);
    expect(mockPosicion1.puntos).toBe(3);
    expect(mockPosicion2.puntos).toBe(0);
  });
});
