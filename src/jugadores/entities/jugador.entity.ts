import { Equipo } from "src/equipos/entities/equipo.entity";
import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from "typeorm";

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

    @Column()
    fecha_nacimiento: Date;

    @Column()
    lugar_nacimiento: string;

    @Column()
    direccion: string;

    @Column()
    suspendido?: boolean = false;

    @ManyToOne(()=> Equipo, (equipo) => equipo.nombre)
    equipo: Equipo; 


}
