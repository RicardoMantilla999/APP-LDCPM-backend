import { Test, TestingModule } from '@nestjs/testing';
import { EquiposService } from './equipos.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Equipo } from './entities/equipo.entity';
import { Categoria } from '../categorias/entities/categoria.entity';
import { Dirigente } from '../dirigentes/entities/dirigente.entity';
import { Campeonato } from '../campeonatos/entities/campeonato.entity';
import { Posicione } from '../posiciones/entities/posicione.entity';
import { Fase } from '../fases/entities/fase.entity';
import { CloudinaryService } from 'src/common/cloudinary/cloudinary.service';

describe('EquiposService', () => {
    let service: EquiposService;
    let equipoRepo: any;
  
    beforeEach(async () => {
      equipoRepo = { update: jest.fn() };
  
      const module: TestingModule = await Test.createTestingModule({
        providers: [
          EquiposService,
          { provide: getRepositoryToken(Equipo), useValue: equipoRepo },
          { provide: getRepositoryToken(Categoria), useValue: {} },
          { provide: getRepositoryToken(Dirigente), useValue: {} },
          { provide: getRepositoryToken(Campeonato), useValue: {} },
          { provide: getRepositoryToken(Posicione), useValue: {} },
          { provide: getRepositoryToken(Fase), useValue: {} },
          { provide: CloudinaryService, useValue: {} },
        ],
      }).compile();
  
      service = module.get<EquiposService>(EquiposService);
    });
  
    describe('actualizarNroSorteo', () => {
      it('debería actualizar correctamente los números de sorteo de los equipos', async () => {
        const equiposInput = [
          { id: 1, nro_sorteo: 3 },
          { id: 2, nro_sorteo: 1 },
        ];
  
        equipoRepo.update.mockResolvedValue({});
  
        const result = await service.actualizarNroSorteo(equiposInput);
  
        expect(equipoRepo.update).toHaveBeenCalledTimes(2);
        expect(equipoRepo.update).toHaveBeenCalledWith(1, { nro_sorteo: 3 });
        expect(equipoRepo.update).toHaveBeenCalledWith(2, { nro_sorteo: 1 });
        expect(result).toEqual({ message: 'Números de sorteo actualizados correctamente.' });
      });
    });
  });