import { Equipo } from "src/equipos/entities/equipo.entity";
import { Fase } from "src/fases/entities/fase.entity";
import { Grupo } from "src/grupos/entities/grupo.entity";
import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class Partido {

    @PrimaryGeneratedColumn()
    id: number;

    @ManyToOne(() => Equipo, (equipo) => equipo.partidos_1, { eager: true, onDelete: 'CASCADE' })
    @JoinColumn({ name: 'equipo_1_id' })
    equipo_1: Equipo;

    @ManyToOne(() => Equipo, (equipo) => equipo.partidos_2, { eager: true, onDelete: 'CASCADE' })
    @JoinColumn({ name: 'equipo_2_id' })
    equipo_2: Equipo;

    @Column({ default: 0 })
    goles_1: number;

    @Column({ default: 0 })
    goles_2: number;

    @ManyToOne(() => Grupo, (grupo) => grupo.partido, { onDelete: 'CASCADE', nullable: true })
    @JoinColumn({ name: 'grupo_id' })
    grupo: Grupo;

    @ManyToOne(() => Fase, (fase) => fase.partido, { onDelete: 'CASCADE' })
    @JoinColumn({ name: 'fase_id' })
    fase: Fase;

    @Column({ type: 'date' })
    fecha: Date;

    @Column({ type: 'time' })
    hora: string;

    @Column({ default: true }) //Opciones: programado, postergado, cancelado, jugado.
    culminado: boolean;

}
