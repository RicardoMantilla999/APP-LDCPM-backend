import { Equipo } from "src/equipos/entities/equipo.entity";
import { Column, DeleteDateColumn, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class Jugador {

    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    cedula: string

    @Column()
    nombres: string;

    @Column()
    apellidos: string;

    @Column()
    dorsal: number;

    @Column({type: 'date', nullable:true})
    fecha_nacimiento: Date;


    @Column()
    lugar_nacimiento: string;


    @Column()
    suspendido?: boolean = false;


    @ManyToOne(() => Equipo, (equipo) => equipo.jugador, { onDelete: 'CASCADE' })
    @JoinColumn({ name: 'equipo_id' })
    equipo: Equipo;
}
