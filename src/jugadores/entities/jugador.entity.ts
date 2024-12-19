import { OrigenJugador } from "src/common/enums/origen.enum";
import { Equipo } from "src/equipos/entities/equipo.entity";
import { Gole } from "src/goles/entities/gole.entity";
import { Tarjeta } from "src/tarjetas/entities/tarjeta.entity";
import { Column, DeleteDateColumn, Entity, JoinColumn, ManyToOne, OneToMany, PrimaryGeneratedColumn } from "typeorm";

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

    @Column({ type: 'date', nullable: true })
    fecha_nacimiento: Date;

    @Column()
    canton_juega: string;

    @Column()
    direccion: string;

    @Column()
    telefono: string;

    @Column()
    email:string;

    @Column({ type: 'enum', enum: OrigenJugador })
    origen:  OrigenJugador;

    @Column({nullable: true})
    foto: string;
    
    @ManyToOne(() => Equipo, (equipo) => equipo.jugador, { onDelete: 'CASCADE' })
    @JoinColumn({ name: 'equipo_id' })
    equipo: Equipo;

    @OneToMany(() => Gole, (gol) => gol.goles, { cascade: true })
    goles: Gole[];

    @OneToMany(() => Tarjeta, (tarjeta) => tarjeta.jugador)
    tarjetas: Tarjeta[];

}
