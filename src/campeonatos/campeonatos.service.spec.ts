import { Test, TestingModule } from '@nestjs/testing';
import { EquiposService } from '../equipos/equipos.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Equipo } from 'src/equipos/entities/equipo.entity';
import { Fase } from 'src/fases/entities/fase.entity';
import { Grupo } from 'src/grupos/entities/grupo.entity';
import { Partido } from 'src/partidos/entities/partido.entity';
import { Categoria } from 'src/categorias/entities/categoria.entity';
import { CampeonatosService } from './campeonatos.service';
import { Dirigente } from 'src/dirigentes/entities/dirigente.entity';
import { Campeonato } from './entities/campeonato.entity';
import { Posicione } from 'src/posiciones/entities/posicione.entity';
import { CloudinaryService } from 'src/common/cloudinary/cloudinary.service';

describe('EquiposService - generarCalendario()', () => {
    let service: CampeonatosService;
    let categoriaRepo: any;
    let faseRepo: any;
    let equipoRepo: any;
    let grupoRepo: any;
    let partidoRepo: any;
    let posicionRepo: any;


    beforeEach(async () => {
        jest.spyOn(console, 'warn').mockImplementation(() => { });
        jest.spyOn(console, 'log').mockImplementation(() => { });
        jest.spyOn(console, 'error').mockImplementation(() => { });
        const mockRepo = () => ({
            findOne: jest.fn(),
            find: jest.fn(),
            save: jest.fn(),
            create: jest.fn(),
        });

        const module: TestingModule = await Test.createTestingModule({
            providers: [
                CampeonatosService,
                { provide: getRepositoryToken(Categoria), useFactory: mockRepo },
                { provide: getRepositoryToken(Equipo), useFactory: mockRepo },
                { provide: getRepositoryToken(Fase), useFactory: mockRepo },
                { provide: getRepositoryToken(Grupo), useFactory: mockRepo },
                { provide: getRepositoryToken(Partido), useFactory: mockRepo },
                { provide: getRepositoryToken(Dirigente), useFactory: mockRepo },
                { provide: getRepositoryToken(Campeonato), useFactory: mockRepo },
                { provide: getRepositoryToken(Posicione), useFactory: mockRepo },
                { provide: getRepositoryToken(Posicione), useFactory: mockRepo },
                { provide: CloudinaryService, useValue: {} },



            ],
        }).compile();

        service = module.get<CampeonatosService>(CampeonatosService);
        categoriaRepo = module.get(getRepositoryToken(Categoria));
        faseRepo = module.get(getRepositoryToken(Fase));
        equipoRepo = module.get(getRepositoryToken(Equipo));
        grupoRepo = module.get(getRepositoryToken(Grupo));
        partidoRepo = module.get(getRepositoryToken(Partido));
        posicionRepo = module.get(getRepositoryToken(Posicione));
    });

    it('debería generar un calendario todos contra todos si hay 15 o menos equipos', async () => {
        const mockCategoria = { id: 1, fase_actual: { orden: 0 }, campeonato: { id: 1 } };
        const mockFase = { orden: 1 };
        const mockEquipos = Array.from({ length: 6 }, (_, i) => ({ id: i + 1, categoria: mockCategoria }));
        const mockPartidos = [{ equipo_1: mockEquipos[0], equipo_2: mockEquipos[1], nro_fecha: 1 }];
        const mockRepo = () => ({
            findOne: jest.fn(),
            find: jest.fn(),
            save: jest.fn(),
            update: jest.fn(),
            delete: jest.fn(),
            create: jest.fn(),
            createQueryBuilder: jest.fn().mockReturnValue({
                innerJoin: jest.fn().mockReturnThis(),
                where: jest.fn().mockReturnThis(),
                andWhere: jest.fn().mockReturnThis(),
                getOne: jest.fn(),
            }),
        });



        categoriaRepo.findOne.mockResolvedValue(mockCategoria);
        faseRepo.findOne.mockResolvedValue(mockFase);
        categoriaRepo.save.mockResolvedValue({});
        equipoRepo.find.mockResolvedValue(mockEquipos);
        service.generarPartidosTodosContraTodos = jest.fn().mockReturnValue(mockPartidos);
        partidoRepo.save.mockResolvedValue(mockPartidos);


        const result = await service.generarCalendario(1, 1);

        expect(partidoRepo.save).toHaveBeenCalledWith(mockPartidos);
        expect(result).toEqual(mockPartidos);
    });

    it('debería generar un calendario por grupos si hay más de 15 equipos', async () => {
        const mockCategoria = { id: 1, fase_actual: { orden: 0 }, campeonato: { id: 1 } };
        const mockFase = { orden: 1 };
        const mockEquipos = Array.from({ length: 16 }, (_, i) => ({ id: i + 1, categoria: mockCategoria }));
        const mockGrupoA = { id: 1, nombre: 'A' };
        const mockGrupoB = { id: 2, nombre: 'B' };
        const mockPartidos = [{ equipo_1: mockEquipos[0], equipo_2: mockEquipos[1], nro_fecha: 1 }];

        categoriaRepo.findOne.mockResolvedValue(mockCategoria);
        faseRepo.findOne.mockResolvedValue(mockFase);
        grupoRepo.findOne.mockImplementation(({ where: { nombre } }) =>
            nombre === 'A' ? mockGrupoA : mockGrupoB
        );
        categoriaRepo.save.mockResolvedValue({});
        equipoRepo.find.mockResolvedValue(mockEquipos);
        service.generarPartidosPorGrupo = jest.fn().mockReturnValue(mockPartidos);
        partidoRepo.save.mockResolvedValue(mockPartidos);

        const result = await service.generarCalendario(1, 1);

        expect(equipoRepo.save).toHaveBeenCalled();
        expect(partidoRepo.save).toHaveBeenCalledWith(expect.arrayContaining(mockPartidos));
        expect(result).toEqual(expect.arrayContaining(mockPartidos));
    });

    it('debería lanzar un error si hay menos de dos equipos', async () => {
        const campeonatoId = 1;
        const categoriaId = 1;

        // Mock de la categoría
        categoriaRepo.findOne = jest.fn().mockResolvedValue({
            fase_actual: { orden: 0 },
        });

        // Mock de la fase siguiente
        faseRepo.findOne = jest.fn().mockResolvedValue({});

        // Mock de los equipos
        equipoRepo.find = jest.fn().mockResolvedValue([]);

        await expect(service.generarCalendario(campeonatoId, categoriaId)).rejects.toThrow('No hay suficientes equipos para generar partidos.');
    });

    it('debería lanzar un error si no se guardan los cambios', async () => {
        const campeonatoId = 1;
        const categoriaId = 1;

        // Mock de la categoría
        categoriaRepo.findOne = jest.fn().mockResolvedValue({
            fase_actual: { orden: 0 },
        });

        // Mock de la fase siguiente
        faseRepo.findOne = jest.fn().mockResolvedValue({});

        // Mock de los equipos
        equipoRepo.find = jest.fn().mockResolvedValue([{ id: 1 }, { id: 2 }]);

        // Mock de la función save para que falle
        categoriaRepo.save = jest.fn().mockRejectedValue(new Error('Error al guardar cambios'));

        await expect(service.generarCalendario(campeonatoId, categoriaId)).rejects.toThrow('Error al guardar cambios');
    });

    



});
