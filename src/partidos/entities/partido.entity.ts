import { Categoria } from "src/categorias/entities/categoria.entity";
import { Equipo } from "src/equipos/entities/equipo.entity";
import { Fase } from "src/fases/entities/fase.entity";
import { Gole } from "src/goles/entities/gole.entity";
import { Grupo } from "src/grupos/entities/grupo.entity";
import { Tarjeta } from "src/tarjetas/entities/tarjeta.entity";
import { Column, Entity, JoinColumn, ManyToOne, OneToMany, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class Partido {

    @PrimaryGeneratedColumn()
    id: number;

    @Column({ default: 0 })
    goles_1: number;

    @Column({ default: 0 })
    goles_2: number;

    @Column()
    nro_fecha: number;

    @Column({ type: 'date', nullable: true })
    fecha: Date;

    @Column({ type: 'time', nullable: true })
    hora: string;

    @Column({ default: true }) //Opciones: programado, postergado, cancelado, jugado.
    culminado: boolean;

    @ManyToOne(() => Equipo, (equipo) => equipo.partidos_1, { eager: true, onDelete: 'CASCADE' })
    @JoinColumn({ name: 'equipo_1_id' })
    equipo_1: Equipo;

    @ManyToOne(() => Equipo, (equipo) => equipo.partidos_2, { eager: true, onDelete: 'CASCADE' })
    @JoinColumn({ name: 'equipo_2_id' })
    equipo_2: Equipo;

    @ManyToOne(() => Fase, (fase) => fase.partido, { onDelete: 'CASCADE' })
    @JoinColumn({ name: 'faseId' })
    fase: Fase;

    @ManyToOne(() => Categoria, (categoria) => categoria.partido, { onDelete: 'CASCADE' })
    @JoinColumn({ name: 'categoriaId' })
    categoria: Categoria;

    @OneToMany(() => Gole, (gol) => gol.partido, { cascade: true })
    goles: Gole[];

    @OneToMany(() => Tarjeta, (tarjeta) => tarjeta.partido)
    tarjetas: Tarjeta[];

}
