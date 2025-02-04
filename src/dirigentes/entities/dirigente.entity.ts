import e from "express";
import { Campeonato } from "src/campeonatos/entities/campeonato.entity";
import { Equipo } from "src/equipos/entities/equipo.entity";
import { Column, DeleteDateColumn, Entity, JoinColumn, ManyToOne, OneToMany, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class Dirigente {


    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    cedula: string;

    @Column()
    nombres: string;

    @Column()
    apellidos: string;

    @Column({ nullable: true })
    telefono: string;

    /**
    equispo: 
     */
    @Column()
    lugar_nacimiento: string;

    @Column({ type: 'date', nullable: true })
    fecha_nacimiento: Date;

    @Column()
    suspendido: boolean;

    @ManyToOne(() => Campeonato, (campeonato) => campeonato.dirigentes, { onDelete: 'CASCADE' })
    @JoinColumn({ name: 'campeonato_id' })
    campeonato: Campeonato;

    @OneToMany(() => Equipo, (equipo) => equipo.dirigente, { cascade: true })
    equipos: Equipo[];
}
