jest.mock('xlsx', () => ({
  read: jest.fn(),
  utils: {
    sheet_to_json: jest.fn(),
  },
}));
import { Test, TestingModule } from '@nestjs/testing';
import { JugadoresService } from './jugadores.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Jugador } from './entities/jugador.entity';
import { Gole } from '../goles/entities/gole.entity';
import { Tarjeta } from '../tarjetas/entities/tarjeta.entity';
import { Equipo } from '../equipos/entities/equipo.entity';
import { Campeonato } from '../campeonatos/entities/campeonato.entity';
import { CloudinaryService } from 'src/common/cloudinary/cloudinary.service';
import * as XLSX from 'xlsx';



describe('JugadoresService - create()', () => {
  let service: JugadoresService;
  let equipoRepo: any;
  let jugadorRepo: any;
  let cloudinaryService: any;
  let golRepo: any;
  let tarjetaRepo: any;


  beforeEach(async () => {
    jest.spyOn(console, 'warn').mockImplementation(() => { });
    jest.spyOn(console, 'log').mockImplementation(() => { });
    jest.spyOn(console, 'error').mockImplementation(() => { });

    const mockEquipo = {
      id: 1,
      nombre: 'Juventud FC',
      categoria: {
        id: 10,
        campeonato: {
          id: 100,
        },
      },
    };

    equipoRepo = {
      findOne: jest.fn().mockResolvedValue(mockEquipo),
    };

    jugadorRepo = {
      findOne: jest.fn().mockResolvedValue(null),
      create: jest.fn().mockImplementation((data) => data),
      save: jest.fn().mockImplementation((data) => ({ id: 1, ...data })),
      delete: jest.fn(),
      createQueryBuilder: jest.fn().mockReturnValue({
        innerJoin: jest.fn().mockReturnThis(),
        where: jest.fn().mockReturnThis(),
        andWhere: jest.fn().mockReturnThis(),
        getOne: jest.fn().mockResolvedValue(null),
      }),
    };

    cloudinaryService = {
      uploadImage: jest.fn().mockResolvedValue({ secure_url: 'http://fake-cloudinary.com/foto.jpg' }),
      deleteImage: jest.fn(),
    };
    golRepo = {
      find: jest.fn(),
    };

    tarjetaRepo = {
      find: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        JugadoresService,
        { provide: getRepositoryToken(Jugador), useValue: jugadorRepo },
        { provide: getRepositoryToken(Gole), useValue: {} },
        { provide: getRepositoryToken(Tarjeta), useValue: {} },
        { provide: getRepositoryToken(Equipo), useValue: { findOne: jest.fn().mockResolvedValue(mockEquipo) } },
        { provide: getRepositoryToken(Campeonato), useValue: {} },
        { provide: CloudinaryService, useValue: cloudinaryService },
        {
          provide: getRepositoryToken(Equipo),
          useValue: equipoRepo, // ahora sí puedes modificarlo
        },
        { provide: getRepositoryToken(Gole), useValue: golRepo },
        { provide: getRepositoryToken(Tarjeta), useValue: tarjetaRepo },


      ],
    }).compile();

    service = module.get<JugadoresService>(JugadoresService);
  });

  it('debería crear un jugador correctamente con datos válidos y sin imagen', async () => {
    const dto = {
      equipo: '1',
      dorsal: '10',
      cedula: '1234567890',
      apellidos: 'Pérez',
      nombres: 'Carlos',
      posicion: 'Delantero',
    };

    const jugadorCreado = await service.create(dto as any);
    expect(jugadorCreado).toHaveProperty('cedula', '1234567890');
    expect(jugadorCreado).toHaveProperty('dorsal', 10);
    expect(jugadorCreado.equipo.id).toBe(1);
  });

  it('debería lanzar error si el dorsal ya existe en el equipo', async () => {
    const dto = {
      equipo: '1',
      dorsal: '10',
      cedula: '5566778899',
      apellidos: 'Torres',
      nombres: 'Javier',
      posicion: 'Arquero',
    };

    jugadorRepo.findOne.mockResolvedValueOnce({ id: 2 });

    await expect(service.create(dto as any)).rejects.toThrow('El dorsal 10 ya está asignado en el equipo Juventud FC.');
  });


  it('debería lanzar error si la cédula ya está registrada en el campeonato', async () => {
    const dto = {
      equipo: '1',
      dorsal: '11',
      cedula: '1234567890',
      apellidos: 'Pazmiño',
      nombres: 'Luis',
      posicion: 'Defensa',
    };

    jugadorRepo.findOne.mockResolvedValue(null);
    jugadorRepo.createQueryBuilder().getOne.mockResolvedValueOnce({ id: 3 });

    await expect(service.create(dto as any)).rejects.toThrow('La cédula 1234567890 ya está registrada en el campeonato.');
  });

  it('debería crear un jugador y subir imagen si se proporciona un archivo', async () => {
    const dto = {
      equipo: '1',
      dorsal: '9',
      cedula: '1112223334',
      apellidos: 'Chávez',
      nombres: 'Daniel',
      posicion: 'Delantero',
    };

    const mockFile = { originalname: 'jugador.jpg', buffer: Buffer.from('fake') } as Express.Multer.File;

    jugadorRepo.findOne.mockResolvedValue(null);
    jugadorRepo.createQueryBuilder().getOne.mockResolvedValue(null);
    cloudinaryService.uploadImage.mockResolvedValue({ secure_url: 'http://fake-cloudinary.com/foto.jpg' });

    const result = await service.create(dto as any, mockFile);
    expect(result.foto).toBe('http://fake-cloudinary.com/foto.jpg');
  });

  it('debería actualizar correctamente un jugador existente', async () => {
    const mockJugador = {
      id: 1,
      nombres: 'Carlos',
      apellidos: 'Pérez',
      dorsal: 10,
      equipo: {
        id: 1,
        nombre: 'Juventud FC',
        categoria: { id: 10 },
        campeonato: { id: 100 },
      },
      foto: null,
    };

    jugadorRepo.findOne.mockResolvedValueOnce(mockJugador);
    jugadorRepo.save.mockResolvedValueOnce({ ...mockJugador, dorsal: 9 });

    const result = await service.update(1, { dorsal: 9 });
    expect(result.dorsal).toBe(9);
  });

  it('debería reemplazar la imagen anterior al actualizar con nueva imagen', async () => {
    const mockJugador = {
      id: 1,
      nombres: 'Carlos',
      apellidos: 'Pérez',
      dorsal: 10,
      equipo: {
        id: 1,
        nombre: 'Juventud FC',
        categoria: {
          id: 10,
          campeonato: {
            id: 100,
          },
        },
      },
      foto: 'http://fake-cloudinary.com/old-image.jpg',
    };

    const mockFile = { originalname: 'nueva.jpg', buffer: Buffer.from('fake') } as Express.Multer.File;

    jugadorRepo.findOne.mockResolvedValueOnce(mockJugador);
    cloudinaryService.deleteImage.mockResolvedValue(null);
    cloudinaryService.uploadImage.mockResolvedValue({ secure_url: 'http://fake-cloudinary.com/nueva.jpg' });
    jugadorRepo.save.mockResolvedValueOnce({ ...mockJugador, foto: 'http://fake-cloudinary.com/nueva.jpg' });

    const result = await service.update(1, {}, mockFile);
    expect(result.foto).toBe('http://fake-cloudinary.com/nueva.jpg');
  });


  it('debería eliminar correctamente un jugador con imagen asociada', async () => {
    const mockJugador = {
      id: 1,
      foto: 'http://fake-cloudinary.com/imagen.jpg',
    };

    jugadorRepo.findOne.mockResolvedValueOnce(mockJugador);
    cloudinaryService.deleteImage.mockResolvedValue(null);
    jugadorRepo.delete.mockResolvedValueOnce({});

    await service.remove(1);

    expect(jugadorRepo.delete).toHaveBeenCalledWith(1);
  });


  it('debería retornar el historial del jugador si existe', async () => {
    const jugadorMock = {
      id: 1,
      nombres: 'Luis',
      apellidos: 'Cordero',
      equipo: {
        nombre: 'Juventud FC',
        categoria: { categoria: 'Sub-20' },
        campeonato: { id: 1, fecha_inicio: '2023-01-01' },
      },
    };

    jugadorRepo.findOne.mockResolvedValue(jugadorMock);
    golRepo.find.mockResolvedValue([{ goles: 2, jugador: jugadorMock }]);
    tarjetaRepo.find.mockResolvedValue([{ tipo: 'Amarilla', jugador: jugadorMock }]);

    const historial = await service.obtenerHistorialPorCedula('1234567890');
    expect(historial).toHaveLength(1);
    expect(historial[0].amarillas).toBeGreaterThanOrEqual(0);
  });

  it('debería lanzar error si no se encuentra un jugador con esa cédula', async () => {
    jugadorRepo.findOne.mockResolvedValue(null);

    await expect(service.obtenerHistorialPorCedula('0000000000')).rejects.toThrow('No se encontró un jugador con la cédula especificada.');
  });


  it('debería importar jugadores desde archivo Excel correctamente', async () => {
    const mockBuffer = Buffer.from('fake-excel');
    const mockFile = { buffer: mockBuffer } as Express.Multer.File;

    const equipo = {
      id: 1,
      nombre: 'Juventud FC',
      categoria: { id: 10 },
      campeonato: { id: 100 },
    };

    equipoRepo.findOne.mockResolvedValue(equipo);
    jugadorRepo.findOne.mockResolvedValue(null);
    jugadorRepo.create.mockReturnValue({ cedula: '111', nombres: 'CARLOS', apellidos: 'PÉREZ', equipo });
    jugadorRepo.save.mockResolvedValue({});

    (XLSX.read as jest.Mock).mockReturnValue({ Sheets: { Hoja1: {} }, SheetNames: ['Hoja1'] });
    XLSX.utils.sheet_to_json = jest.fn().mockReturnValue([
      { cedula: '111', nombres: 'Carlos', apellidos: 'Pérez', fecha_nacimiento: '2000-01-01', canton_juega: 'Tabacundo', direccion: 'Av. Quito', telefono: '0991234567', email: 'test@mail.com' },
    ]);

    const resultado = await service.importarJugadores(mockFile, 1);
    expect(resultado.message).toContain('importados exitosamente');
  });


  it('debería ignorar jugadores con cédula duplicada en el equipo', async () => {
    const mockFile = { buffer: Buffer.from('fake') } as Express.Multer.File;

    (XLSX.read as jest.Mock).mockReturnValue({ Sheets: { Hoja1: {} }, SheetNames: ['Hoja1'] });
    XLSX.utils.sheet_to_json = jest.fn().mockReturnValue([
      { cedula: '123', nombres: 'Juan', apellidos: 'Lopez', fecha_nacimiento: '1990-01-01', canton_juega: 'Tabacundo', direccion: '', telefono: '', email: '' },
    ]);

    equipoRepo.findOne.mockResolvedValue({ id: 1, categoria: { id: 10 }, campeonato: { id: 100 } });
    jugadorRepo.findOne.mockResolvedValue({ id: 1 });

    const resultado = await service.importarJugadores(mockFile, 1);
    expect(resultado.ignorados).toContain('123');
  });


  it('debería lanzar error si faltan columnas requeridas', async () => {
    const mockFile = { buffer: Buffer.from('fake') } as Express.Multer.File;

    (XLSX.read as jest.Mock).mockReturnValue({ Sheets: { Hoja1: {} }, SheetNames: ['Hoja1'] });
    XLSX.utils.sheet_to_json = jest.fn().mockReturnValue([{ nombres: 'Sin Cédula' }]);

    await expect(service.importarJugadores(mockFile, 1)).rejects.toThrow('El archivo no contiene las siguientes columnas obligatorias');
  });

  it('debería lanzar error si no hay datos válidos para importar', async () => {
    const mockFile = { buffer: Buffer.from('fake') } as Express.Multer.File;

    (XLSX.read as jest.Mock).mockReturnValue({ Sheets: { Hoja1: {} }, SheetNames: ['Hoja1'] });
    XLSX.utils.sheet_to_json = jest.fn().mockReturnValue([
      {
        cedula: '', // vacía
        nombres: 'Juan',
        apellidos: 'Perez',
        fecha_nacimiento: '2000-01-01',
        canton_juega: 'Tabacundo',
        direccion: 'Av. Quito',
        telefono: '0999999999',
        email: 'juan@mail.com',
      },
    ]);

    await expect(service.importarJugadores(mockFile, 1)).rejects.toThrow('No hay datos válidos para importar.');
  });


  it('debería retornar el historial del jugador si existe', async () => {
    const jugadorMock = {
      id: 1,
      cedula: '1234567890',
      nombres: 'Juan',
      apellidos: 'Pérez',
      equipo: {
        nombre: 'Equipo A',
        categoria: { categoria: 'Sub-18' },
        campeonato: { fecha_inicio: '2023-01-01' },
      },
    };

    const golesMock = [
      { goles: 2, jugador: jugadorMock },
    ];

    const tarjetasMock = [
      { tipo: 'Amarilla', jugador: jugadorMock },
    ];

    jugadorRepo.findOne.mockResolvedValue(jugadorMock);
    golRepo.find.mockResolvedValue(golesMock);
    tarjetaRepo.find.mockResolvedValue(tarjetasMock);

    const historial = await service.obtenerHistorialPorCedula('1234567890');

    expect(historial).toHaveLength(1);
    expect(historial[0]).toMatchObject({
      temporada: 2022,
      nombres: 'Juan',
      apellidos: 'Pérez',
      equipo: 'Equipo A',
      categoria: 'Sub-18',
      goles: 2,
      amarillas: 0,
      rojas: 0,
    });
  });

  it('debería lanzar error si no se encuentra un jugador con esa cédula', async () => {
    jugadorRepo.findOne.mockResolvedValue(null);

    await expect(service.obtenerHistorialPorCedula('9999999999')).rejects.toThrow('No se encontró un jugador con la cédula especificada.');
  });



});
