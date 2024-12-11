import { TipoTarjeta } from "src/common/enums/tarjetas.enum";
import { Equipo } from "src/equipos/entities/equipo.entity";
import { Jugador } from "src/jugadores/entities/jugador.entity";
import { Partido } from "src/partidos/entities/partido.entity";
import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from "typeorm";


@Entity()
export class Tarjeta {

    @PrimaryGeneratedColumn()
    id: number;

    @Column({ type: 'enum', enum: TipoTarjeta })
    tipo: TipoTarjeta;

    @ManyToOne(() => Jugador, (jugador) => jugador.tarjetas, { eager: true, onDelete: 'CASCADE' })
    @JoinColumn({ name: 'jugadorId' })
    jugador: Jugador;

    @ManyToOne(() => Partido, (partido) => partido.tarjetas, { eager: true, onDelete: 'CASCADE' })
    @JoinColumn({ name: 'partidoId' })
    partido: Partido;

    @ManyToOne(() => Equipo, (equipo) => equipo.tarjetas, { eager: true, onDelete: 'CASCADE' })
    @JoinColumn({ name: 'equipoId' })
    equipo: Equipo;


}
