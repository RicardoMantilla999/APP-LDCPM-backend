import { Categoria } from "src/categorias/entities/categoria.entity";
import { Equipo } from "src/equipos/entities/equipo.entity";
import { Fase } from "src/fases/entities/fase.entity";
import { Grupo } from "src/grupos/entities/grupo.entity";
import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class Posicione {

    @PrimaryGeneratedColumn()
    id: number;

    @Column({ default: 0 })
    puntos: number;

    @Column({ default: 0 })
    golesFavor: number;

    @Column({ default: 0 })
    golesContra: number;

    @Column({ default: 0 })
    diferenciaGoles: number;

    @Column({ default: 0 })
    partidosJugados: number;

    @Column({ default: 0 })
    partidosGanados: number;

    @Column({ default: 0 })
    partidosEmpatados: number;

    @Column({ default: 0 })
    partidosPerdidos: number;

    @ManyToOne(() => Equipo, (equipo) => equipo.posiciones)
    @JoinColumn({ name: 'equipo_id' })
    equipo: Equipo;

    @ManyToOne(() => Categoria)
    @JoinColumn({ name: 'categoria_id' })
    categoria: Categoria;

    @ManyToOne(() => Fase)
    @JoinColumn({ name: 'fase_id' })
    fase: Fase;

    @ManyToOne(() => Grupo, (grupo) => grupo.posiciones, { nullable: true })
    grupo: Grupo;



}
