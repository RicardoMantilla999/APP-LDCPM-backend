import { Type } from "class-transformer";
import { IsDate, IsNotEmpty } from "class-validator";
import { Campeonato } from "src/campeonatos/entities/campeonato.entity";
import { Categoria } from "src/categorias/entities/categoria.entity";
import { Dirigente } from "src/dirigentes/entities/dirigente.entity";
import { Jugador } from "src/jugadores/entities/jugador.entity";
import { Partido } from "src/partidos/entities/partido.entity";
import { Sorteo } from "src/sorteos/entities/sorteo.entity";
import { Column, DeleteDateColumn, Entity, JoinColumn, ManyToOne, OneToMany, PrimaryColumn, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class Equipo {

    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    nombre: string;

    @Column()
    uniforme: string;

    @ManyToOne(() => Categoria, (cat) => cat.categoria, { eager: true })
    categoria: Categoria;

    @ManyToOne(() => Dirigente, (dirigente) => dirigente.nombres, { eager: true })
    dirigente: Dirigente;

    @Column({ type: 'date', nullable: true })
    fecha_fundacion: Date;

    @OneToMany(() => Partido, (partido) => partido.equipo_1)
    partidos_1: Partido[];

    @OneToMany(() => Partido, (partido) => partido.equipo_2)
    partidos_2: Partido[];

    @ManyToOne(() => Campeonato, (campeonato) => campeonato.equipos, { onDelete: 'CASCADE' })
    @JoinColumn({ name: 'campeonato_id' })
    campeonato: Campeonato;

    @OneToMany(() => Jugador, (jugador) => jugador.equipo, { cascade: true })
    jugador: Jugador[];

    @OneToMany(() => Sorteo, (sorteo) => sorteo.equipo, { cascade: true })
    sorteo: Sorteo[];
}
