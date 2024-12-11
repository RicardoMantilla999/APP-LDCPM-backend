import { Campeonato } from "src/campeonatos/entities/campeonato.entity";
import { Categoria } from "src/categorias/entities/categoria.entity";
import { Equipo } from "src/equipos/entities/equipo.entity";
import { Fase } from "src/fases/entities/fase.entity";
import { Jugador } from "src/jugadores/entities/jugador.entity";
import { Partido } from "src/partidos/entities/partido.entity";
import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class Gole {

  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  goles: number; // Cantidad de goles en ese registro

  // Relación con el Jugador
  @ManyToOne(() => Jugador, jugador => jugador.goles, { eager: true, onDelete: 'CASCADE' })
  @JoinColumn({ name: 'jugadorId' })
  jugador: Jugador;

  // Relación con el Partido
  @ManyToOne(() => Partido, partido => partido.goles, { eager: true, onDelete: 'CASCADE' })
  @JoinColumn({ name: 'partidoId' })
  partido: Partido;

  // Relación con el Equipo
  @ManyToOne(() => Equipo, equipo => equipo.goles, { eager: true, onDelete: 'CASCADE' })
  @JoinColumn({ name: 'equipoId' })
  equipo: Equipo;


}
