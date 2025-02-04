import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateCampeonatoDto } from './dto/create-campeonato.dto';
import { UpdateCampeonatoDto } from './dto/update-campeonato.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Campeonato } from './entities/campeonato.entity';
import { In, Repository } from 'typeorm';
import { Partido } from 'src/partidos/entities/partido.entity';
import { Equipo } from 'src/equipos/entities/equipo.entity';
import { Categoria } from 'src/categorias/entities/categoria.entity';
import { Fase } from 'src/fases/entities/fase.entity';
import { Posicione } from 'src/posiciones/entities/posicione.entity';
import { Grupo } from 'src/grupos/entities/grupo.entity';

@Injectable()
export class CampeonatosService {

  constructor(
    @InjectRepository(Campeonato)
    private readonly campeonatoRepository: Repository<Campeonato>,
    @InjectRepository(Partido)
    private readonly partidoRepository: Repository<Partido>,
    @InjectRepository(Equipo)
    private readonly equipoRepository: Repository<Equipo>,
    @InjectRepository(Fase)
    private readonly faseRepository: Repository<Fase>,
    @InjectRepository(Categoria)
    private readonly categoriaRepository: Repository<Categoria>,
    @InjectRepository(Posicione)
    private readonly posicionRepository: Repository<Posicione>,
    @InjectRepository(Grupo)
    private readonly grupoRepository: Repository<Grupo>,

  ) { }

  async create(createCampeonatoDto: CreateCampeonatoDto) {
    return await this.campeonatoRepository.save(createCampeonatoDto);
  }


  async findAll() {
    return await this.campeonatoRepository.find();
  }

  async findOne(id: number) {
    return await this.campeonatoRepository.findOneBy({ id });
  }

  async update(campeonatoId: number, updateCampeonatoDto: UpdateCampeonatoDto) {
    // Buscar el campeonato por ID e incluir la relación con la fase_actual
    const campeonato = await this.campeonatoRepository.findOne({
      where: { id: campeonatoId },
      relations: ['fase_actual'],  // Asegúrate de incluir la relación con la fase
    });

    if (!campeonato) {
      throw new NotFoundException('Campeonato no encontrado');
    }

    // Actualizar nombre, fechas de inicio y fin si están presentes en el DTO
    if (updateCampeonatoDto.nombre) {
      campeonato.nombre = updateCampeonatoDto.nombre;
    }

    if (updateCampeonatoDto.fecha_inicio) {
      campeonato.fecha_inicio = updateCampeonatoDto.fecha_inicio;
    }

    if (updateCampeonatoDto.fecha_fin) {
      campeonato.fecha_fin = updateCampeonatoDto.fecha_fin;
    }


    // Guardamos los cambios
    return await this.campeonatoRepository.save(campeonato);
  }




  async remove(id: number) {
    return await this.campeonatoRepository.delete(id);
  }


  // Generar el calendario de partidos fase de grupos
  async generarCalendario(campeonatoId: number, categoriaId: number): Promise<Partido[]> {
    try {
      const categoria = await this.categoriaRepository.findOne({
        where: { id: categoriaId, campeonato: { id: campeonatoId }, fase_actual: { orden: 0 } },
        relations: ['fase_actual', 'campeonato'],
      });

      if (!categoria) throw new NotFoundException('La categoría no fue encontrada.');

      const faseActual = categoria.fase_actual;
      if (!faseActual) throw new Error('No hay una fase actual configurada para la categoría.');

      if (faseActual.orden !== 0) {
        throw new Error('El calendario solo se puede generar en la fase de inscripción.');
      }

      const siguienteFase = await this.faseRepository.findOne({
        where: { orden: faseActual.orden + 1 },
      });

      if (!siguienteFase) throw new Error('No se encontró la siguiente fase.');

      categoria.fase_actual = siguienteFase;
      await this.categoriaRepository.save(categoria);

      const equipos = await this.equipoRepository.find({
        where: { categoria: { id: categoriaId }, campeonato: { id: campeonatoId } },
        order: { nro_sorteo: 'ASC' },
      });

      if (equipos.length < 2) throw new Error('No hay suficientes equipos para generar partidos.');

      const totalEquipos = equipos.length;

      if (totalEquipos > 15) {
        // Dividir equipos en dos grupos
        const grupoA = await this.grupoRepository.findOne({ where: { nombre: 'A' } });
        const grupoB = await this.grupoRepository.findOne({ where: { nombre: 'B' } });

        const mitad = Math.ceil(totalEquipos / 2);

        const GrupoA = equipos.slice(0, mitad).map(equipo => ({ ...equipo, grupo: grupoA }));
        const GrupoB = equipos.slice(mitad).map(equipo => ({ ...equipo, grupo: grupoB }));

        // Asignar los grupos a los equipos
        await this.equipoRepository.save([...GrupoA, ...GrupoB]);

        // Generar partidos para cada grupo
        const partidos = [
          ...this.generarPartidosPorGrupo(GrupoA, siguienteFase),
          ...this.generarPartidosPorGrupo(GrupoB, siguienteFase),
        ];

        return await this.partidoRepository.save(partidos);
      } else {
        // Todos contra todos
        const partidos = this.generarPartidosTodosContraTodos(equipos, siguienteFase);
        return await this.partidoRepository.save(partidos);
      }
    } catch (error) {
      console.error('Error en generarCalendario:', error.message, error.stack);
      throw error;
    }
  }

  private generarPartidosTodosContraTodos(equipos: Equipo[], fase: Fase): Partido[] {
    const partidos: Partido[] = [];
    const totalEquipos = equipos.length;

    // Si el número de equipos es impar, añadimos un equipo "fantasma" para equilibrar las fechas
    const equiposConFantasma = [...equipos];
    if (totalEquipos % 2 !== 0) {
      equiposConFantasma.push(null); // `null` representa un descanso
    }

    const totalFechas = equiposConFantasma.length - 1; // Número de fechas necesarias
    const mitad = equiposConFantasma.length / 2; // División para rotación

    // Inicializamos las listas de equipos para rotación
    const rotacion = [...equiposConFantasma];
    const equiposFijos = rotacion.shift(); // El primer equipo no rota

    let nroFecha = 1; // Contador para número de fecha

    for (let fecha = 0; fecha < totalFechas; fecha++) {
      for (let i = 0; i < mitad; i++) {
        const equipo1 = i === 0 ? equiposFijos : rotacion[i - 1];
        const equipo2 = rotacion[rotacion.length - i - 1];

        // Si uno de los equipos es `null`, significa que alguien descansa
        if (equipo1 && equipo2) {
          partidos.push(
            this.partidoRepository.create({
              equipo_1: equipo1,
              equipo_2: equipo2,
              fase,
              categoria: equipo1.categoria,
              nro_fecha: nroFecha,
              culminado: false,
            })
          );
        }
      }

      // Rotación de equipos (Round-Robin)
      rotacion.push(rotacion.shift()!);
      nroFecha++; // Incrementamos el contador de fechas
    }

    return partidos;
  }


  private generarPartidosPorGrupo(equipos: Equipo[], fase: Fase): Partido[] {
    return this.generarPartidosTodosContraTodos(equipos, fase);
  }


  async generarCalendarioCuartos(categoriaId: number): Promise<void> {
    // Verificar si todos los partidos de la fase actual están finalizados
    const partidosPendientes = await this.partidoRepository.find({
      where: { categoria: { id: categoriaId }, fase: { orden: 1 }, culminado: false },
      relations: ['fase'],
    });

    if (partidosPendientes.length > 0) {
      throw new Error('Aún hay partidos pendientes en la fase actual.');
    }

    // Obtener la fase actual y la siguiente
    const faseActual = await this.faseRepository.findOne({
      where: { categorias: { id: categoriaId } },
      relations: ['categorias'],
    });

    if (!faseActual) {
      throw new Error('No se encontró la fase actual.');
    }

    const siguienteFase = await this.faseRepository.findOne({
      where: { orden: faseActual.orden + 1 },
    });

    if (!siguienteFase) {
      throw new Error('No se encontró la siguiente fase.');
    }

    // Obtener todos los equipos de la categoría
    const equipos = await this.equipoRepository.find({
      where: { categoria: { id: categoriaId } },
    });

    if (equipos.length < 8) {
      throw new Error('No hay suficientes equipos para generar los cuartos de final.');
    }

    // Decidir el enfoque según el número de equipos
    if (equipos.length > 15) {
      // Más de 15 equipos: dividir en grupos A y B
      const grupoA = await this.grupoRepository.findOne({ where: { nombre: 'A' } });
      const grupoB = await this.grupoRepository.findOne({ where: { nombre: 'B' } });

      if (!grupoA || !grupoB) {
        throw new Error('No se encontraron los grupos requeridos. Asegúrate de que "Grupo A" y "Grupo B" existen en la base de datos.');
      }

      // Obtener los 4 primeros de cada grupo según la tabla de posiciones
      const posicionesGrupoA = await this.posicionRepository.find({
        where: {
          categoria: { id: categoriaId },
          equipo: { grupo: { id: grupoA.id } }, // Aquí usamos el grupo de los equipos
        },
        order: { puntos: 'DESC', diferenciaGoles: 'DESC' },
        take: 4, // Tomar los 4 primeros del grupo A
        relations: ['equipo', 'equipo.grupo'], // Aseguramos que traemos la relación del grupo del equipo
      });

      const posicionesGrupoB = await this.posicionRepository.find({
        where: {
          categoria: { id: categoriaId },
          equipo: { grupo: { id: grupoB.id } }, // Aquí usamos el grupo de los equipos
        },
        order: { puntos: 'DESC', diferenciaGoles: 'DESC' },
        take: 4, // Tomar los 4 primeros del grupo B
        relations: ['equipo', 'equipo.grupo'], // Aseguramos que traemos la relación del grupo del equipo
      });

      if (posicionesGrupoA.length < 4 || posicionesGrupoB.length < 4) {
        throw new Error('No hay suficientes equipos clasificados en los grupos para generar los cuartos de final.');
      }

      const equiposGrupoA = posicionesGrupoA.map(posicion => posicion.equipo);
      const equiposGrupoB = posicionesGrupoB.map(posicion => posicion.equipo);

      // Crear los partidos cruzados
      const partidos = [
        { equipo_1: equiposGrupoA[0], equipo_2: equiposGrupoB[3], grupo: grupoA }, // 1ro A vs 4to B
        { equipo_1: equiposGrupoA[1], equipo_2: equiposGrupoB[2], grupo: grupoA }, // 2do A vs 3ro B
        { equipo_1: equiposGrupoB[0], equipo_2: equiposGrupoA[3], grupo: grupoB }, // 1ro B vs 4to A
        { equipo_1: equiposGrupoB[1], equipo_2: equiposGrupoA[2], grupo: grupoB }, // 2do B vs 3ro A
      ];

      for (const partido of partidos) {
        await this.partidoRepository.save({
          equipo_1: partido.equipo_1,
          equipo_2: partido.equipo_2,
          fase: siguienteFase,
          categoria: { id: categoriaId },
          grupo: partido.grupo,
          culminado: false,
          goles_1: 0,
          goles_2: 0,
          nro_fecha: 1, // Cuartos de final, misma fecha
        });
      }
    } else {

      const grupoA = await this.grupoRepository.findOne({ where: { nombre: 'A' } });
      const grupoB = await this.grupoRepository.findOne({ where: { nombre: 'B' } });

      if (!grupoA || !grupoB) {
        throw new Error('No se encontraron los grupos requeridos. Asegúrate de que "Grupo A" y "Grupo B" existen en la base de datos.');
      }

      // Menos de 15 equipos: tomar los 8 mejores directamente
      const equiposClasificados = await this.posicionRepository.find({
        where: {
          categoria: { id: categoriaId }
        },
        order: { puntos: 'DESC', diferenciaGoles: 'DESC' },
        take: 8, // Tomar los 8 primeros
        relations: ['equipo', 'equipo.grupo'],
      });

      if (equiposClasificados.length < 8) {
        throw new Error('No hay suficientes equipos clasificados para generar los cuartos de final.');
      }

      const equipos = equiposClasificados.map(posicion => posicion.equipo);

      // Crear los partidos cruzados
      const partidos = [
        { equipo_1: equipos[0], equipo_2: equipos[7], grupo: grupoA }, // 1ro vs 8vo
        { equipo_1: equipos[2], equipo_2: equipos[5], grupo: grupoA }, // 2do vs 7mo
        { equipo_1: equipos[1], equipo_2: equipos[6], grupo: grupoB }, // 3ro vs 6to
        { equipo_1: equipos[3], equipo_2: equipos[4], grupo: grupoB }, // 4to vs 5to
      ];

      for (const partido of partidos) {
        await this.partidoRepository.save({
          equipo_1: partido.equipo_1,
          equipo_2: partido.equipo_2,
          fase: siguienteFase,
          categoria: { id: categoriaId },
          grupo: partido.grupo,
          culminado: false,
          goles_1: 0,
          goles_2: 0,
          nro_fecha: 1, // Cuartos de final, misma fecha
        });
      }
    }

    // Actualizar la fase actual de la categoría
    const categoria = await this.categoriaRepository.findOne({ where: { id: categoriaId } });
    if (categoria) {
      categoria.fase_actual = siguienteFase;
      await this.categoriaRepository.save(categoria);
    }
  }





  // CALENDARIO PARA SEMIFINALES (LLAVE PREDETERMINADA)
  async generarCalendarioSemifinales(categoriaId: number): Promise<void> {
    // Verificar si todos los partidos de los cuartos están finalizados
    const partidosPendientes = await this.partidoRepository.find({
      where: { categoria: { id: categoriaId }, fase: { orden: 2 }, culminado: false },
      relations: ['fase'],
    });

    if (partidosPendientes.length > 0) {
      throw new Error('Aún hay partidos pendientes en los cuartos de final.');
    }

    // Obtener la fase actual y la siguiente
    const faseActual = await this.faseRepository.findOne({
      where: { categorias: { id: categoriaId } },
      relations: ['categorias'],
    });

    if (!faseActual) {
      throw new Error('No se encontró la fase actual.');
    }

    const siguienteFase = await this.faseRepository.findOne({
      where: { orden: faseActual.orden + 1 },
    });

    if (!siguienteFase) {
      throw new Error('No se encontró la siguiente fase.');
    }

    // Obtener los ganadores de los cuartos de final
    const partidosCuartos = await this.partidoRepository.find({
      where: { categoria: { id: categoriaId }, fase: { orden: 2 }, culminado: true },
      relations: ['equipo_1', 'equipo_2', 'grupo'],
    });

    // Clasificar ganadores por grupo
    const ganadoresGrupoA = [];
    const ganadoresGrupoB = [];
    for (const partido of partidosCuartos) {
      const ganador =
        partido.goles_1 > partido.goles_2
          ? partido.equipo_1
          : partido.goles_2 > partido.goles_1
            ? partido.equipo_2
            : null;

      if (!ganador) {
        throw new Error(
          `El partido entre ${partido.equipo_1.nombre} y ${partido.equipo_2.nombre} terminó en empate. Es necesario resolver el empate.`
        );
      }

      if (partido.grupo.nombre === 'A') {
        ganadoresGrupoA.push({ equipo: ganador, grupo: partido.grupo });
      } else if (partido.grupo.nombre === 'B') {
        ganadoresGrupoB.push({ equipo: ganador, grupo: partido.grupo });
      }
    }

    if (ganadoresGrupoA.length !== 2 || ganadoresGrupoB.length !== 2) {
      throw new Error('No hay suficientes ganadores en cada grupo para generar las semifinales.');
    }

    // Obtener los grupos A y B desde la base de datos
    const grupoA = await this.grupoRepository.findOne({ where: { nombre: 'A' } });
    const grupoB = await this.grupoRepository.findOne({ where: { nombre: 'B' } });

    if (!grupoA || !grupoB) {
      throw new Error('No se encontraron los grupos requeridos. Asegúrate de que "Grupo A" y "Grupo B" existen en la base de datos.');
    }

    // Crear los partidos de semifinales con la estructura correcta
    const partidosSemifinales = [
      { equipo_1: ganadoresGrupoA[0].equipo, equipo_2: ganadoresGrupoA[1].equipo, grupo: grupoA }, // Grupo A
      { equipo_1: ganadoresGrupoB[0].equipo, equipo_2: ganadoresGrupoB[1].equipo, grupo: grupoB }, // Grupo B
    ];

    for (const partido of partidosSemifinales) {
      if (!partido.equipo_1 || !partido.equipo_2 || !partido.grupo) {
        throw new Error(
          `Datos incompletos para el partido: ${JSON.stringify(partido)}`
        );
      }

      console.log('Guardando partido:', partido);

      await this.partidoRepository.save({
        equipo_1: partido.equipo_1,
        equipo_2: partido.equipo_2,
        fase: siguienteFase,
        categoria: { id: categoriaId },
        culminado: false,
        goles_1: 0,
        goles_2: 0,
        grupo: partido.grupo,
        nro_fecha: 1, // Fecha de semifinales
      });
    }

    // Actualizar la fase_actual de la categoría
    const categoria = await this.categoriaRepository.findOne({ where: { id: categoriaId } });
    if (categoria) {
      categoria.fase_actual = siguienteFase;
      await this.categoriaRepository.save(categoria);
    }
  }





  // CALENDARIO PARA LA FINAL
  async generarCalendarioFinal(categoriaId: number): Promise<void> {
    // Verificar si todos los partidos de las semifinales están finalizados
    const partidosPendientes = await this.partidoRepository.find({
      where: { categoria: { id: categoriaId }, fase: { orden: 3 }, culminado: false },
      relations: ['fase'],
    });

    if (partidosPendientes.length > 0) {
      throw new Error('Aún hay partidos pendientes en las semifinales.');
    }

    // Obtener la fase actual y la siguiente
    const faseActual = await this.faseRepository.findOne({
      where: { categorias: { id: categoriaId } },
      relations: ['categorias'],
    });

    if (!faseActual) {
      throw new Error('No se encontró la fase actual.');
    }

    const siguienteFase = await this.faseRepository.findOne({
      where: { orden: faseActual.orden + 1 }, // Buscar la siguiente fase según el orden
    });

    if (!siguienteFase) {
      throw new Error('No se encontró la siguiente fase.');
    }

    // Obtener los partidos semifinales y clasificar los ganadores y perdedores por grupo
    const partidosSemifinales = await this.partidoRepository.find({
      where: { categoria: { id: categoriaId }, fase: { orden: 3 }, culminado: true },
      relations: ['equipo_1', 'equipo_2', 'grupo'],
    });

    let ganadorGrupoA = [];
    let ganadorGrupoB = [];

    for (const partido of partidosSemifinales) {
      const ganador =
        partido.goles_1 > partido.goles_2
          ? partido.equipo_1
          : partido.goles_2 > partido.goles_1
            ? partido.equipo_2
            : null;

      const perdedor = ganador === partido.equipo_1 ? partido.equipo_2 : partido.equipo_1;

      if (!ganador) {
        throw new Error(`El partido entre ${partido.equipo_1.nombre} y ${partido.equipo_2.nombre} terminó en empate. Es necesario resolver el empate.`);
      }

      if (partido.grupo.nombre === 'A') {
        ganadorGrupoA.push(ganador);
      } else if (partido.grupo.nombre === 'B') {
        ganadorGrupoB.push(ganador);
      }
    }

    if (!ganadorGrupoA || !ganadorGrupoB) {
      throw new Error('No se encontraron suficientes ganadores o perdedores para generar la final.');
    }

    // Crear los partidos finales: uno entre ganadores y otro entre perdedores
    const partidosFinales = [
      { equipo_1: ganadorGrupoA[0], equipo_2: ganadorGrupoB[0] }// Ganadores del Grupo A vs Grupo B
    ];

    // Crear los partidos de la final y de los perdedores
    for (const partido of partidosFinales) {
      await this.partidoRepository.save({
        equipo_1: partido.equipo_1,
        equipo_2: partido.equipo_2,
        fase: siguienteFase,
        categoria: { id: categoriaId },
        culminado: false,
        goles_1: 0,
        goles_2: 0,
        nro_fecha: 1, // Fecha 1 para la final, Fecha 2 para los perdedores
      });
    }

    // Actualizar la fase_actual de la categoría
    const categoria = await this.categoriaRepository.findOne({ where: { id: categoriaId } });
    if (categoria) {
      categoria.fase_actual = siguienteFase;
      await this.categoriaRepository.save(categoria);
    }
  }





  async actualizarCampeonato(id: number, updateCampeonatoDto: UpdateCampeonatoDto): Promise<Campeonato> {
    // Buscar el campeonato por ID
    const campeonato = await this.campeonatoRepository.findOne({ where: { id } });

    if (!campeonato) {
      throw new NotFoundException(`El campeonato con ID ${id} no fue encontrado`);
    }

    // Actualizar el campeonato con los valores proporcionados en el DTO
    Object.assign(campeonato, updateCampeonatoDto);

    // Guardar los cambios en la base de datos
    return this.campeonatoRepository.save(campeonato);
  }


  async actualizarFasePosiciones(categoriaId: number, nuevaFaseId: number): Promise<void> {
    const nuevaFase = await this.faseRepository.findOne({ where: { id: nuevaFaseId } });
    if (!nuevaFase) {
      throw new NotFoundException('No se encontró la fase especificada.');
    }

    const posiciones = await this.posicionRepository.find({
      where: { categoria: { id: categoriaId } },
    });

    for (const posicion of posiciones) {
      posicion.fase = nuevaFase; // Asignar el objeto completo
      await this.posicionRepository.save(posicion);
    }
  }



}






