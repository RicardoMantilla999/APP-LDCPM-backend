import { Test, TestingModule } from '@nestjs/testing';
import { GolesService } from './goles.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Jugador } from '../jugadores/entities/jugador.entity';
import { Equipo } from '../equipos/entities/equipo.entity';
import { Partido } from '../partidos/entities/partido.entity';
import { Gole } from './entities/gole.entity';
import { NotFoundException, InternalServerErrorException } from '@nestjs/common';

describe('GolesService', () => {
  let service: GolesService;
  let jugadoresRepo: any;
  let equiposRepo: any;
  let partidosRepo: any;
  let golesRepo: any;

  beforeEach(async () => {
    jest.spyOn(console, 'warn').mockImplementation(() => { });
    jest.spyOn(console, 'log').mockImplementation(() => { });
    jest.spyOn(console, 'error').mockImplementation(() => { });
    const mockRepo = () => ({
      findOne: jest.fn(),
      save: jest.fn(),
      create: jest.fn(),
    });

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        GolesService,
        { provide: getRepositoryToken(Jugador), useFactory: mockRepo },
        { provide: getRepositoryToken(Equipo), useFactory: mockRepo },
        { provide: getRepositoryToken(Partido), useFactory: mockRepo },
        { provide: getRepositoryToken(Gole), useFactory: mockRepo },
      ],
    }).compile();

    service = module.get<GolesService>(GolesService);
    jugadoresRepo = module.get(getRepositoryToken(Jugador));
    equiposRepo = module.get(getRepositoryToken(Equipo));
    partidosRepo = module.get(getRepositoryToken(Partido));
    golesRepo = module.get(getRepositoryToken(Gole));
  });

  it('debería guardar un gol correctamente', async () => {
    const jugador = { id: 1 };
    const equipo = { id: 1 };
    const partido = { id: 1 };
    const golCreado = { id: 1, goles: 2, jugador, equipo, partido };

    jugadoresRepo.findOne.mockResolvedValue(jugador);
    equiposRepo.findOne.mockResolvedValue(equipo);
    partidosRepo.findOne.mockResolvedValue(partido);
    golesRepo.create.mockReturnValue(golCreado);
    golesRepo.save.mockResolvedValue(golCreado);
    service.actualizarResultadoPartido = jest.fn();

    await service.guardarGoles(1, 2, 1, 1);

    expect(golesRepo.create).toHaveBeenCalledWith({ goles: 2, jugador, equipo, partido });
    expect(golesRepo.save).toHaveBeenCalledWith(golCreado);
    expect(service.actualizarResultadoPartido).toHaveBeenCalledWith(1);
  });


  it('debería actualizar el resultado del partido correctamente', async () => {
    const partido = {
      id: 1,
      goles: [
        { equipo: { id: 1 }, goles: 2 },
        { equipo: { id: 2 }, goles: 1 },
      ],
      equipo_1: { id: 1 },
      equipo_2: { id: 2 },
      goles_1: 0, // ✅ agregado para test
      goles_2: 0, // ✅ agregado para test
    };


    partidosRepo.findOne.mockResolvedValue(partido);
    partidosRepo.save.mockResolvedValue(partido);

    await service.actualizarResultadoPartido(1);

    expect(partido.goles_1).toBe(2);
    expect(partido.goles_2).toBe(1);
    expect(partidosRepo.save).toHaveBeenCalledWith(partido);
  });


});
