import { Type } from "class-transformer";
import { IsDate, IsNotEmpty } from "class-validator";
import { Campeonato } from "src/campeonatos/entities/campeonato.entity";
import { Categoria } from "src/categorias/entities/categoria.entity";
import { Dirigente } from "src/dirigentes/entities/dirigente.entity";
import { Fase } from "src/fases/entities/fase.entity";
import { Gole } from "src/goles/entities/gole.entity";
import { Grupo } from "src/grupos/entities/grupo.entity";
import { Jugador } from "src/jugadores/entities/jugador.entity";
import { Partido } from "src/partidos/entities/partido.entity";
import { Posicione } from "src/posiciones/entities/posicione.entity";
import { Tarjeta } from "src/tarjetas/entities/tarjeta.entity";
import { Column, Entity, JoinColumn, ManyToOne, OneToMany, PrimaryColumn, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class Equipo {

    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    nombre: string;

    @Column()
    uniforme: string;

    @Column({ nullable: true, default: 0 })
    nro_sorteo: number;

    @Column({ type: 'date', nullable: true })
    fecha_fundacion: Date;

    @Column({ nullable: true })
    logo: string;

    @ManyToOne(() => Categoria, (cat) => cat.equipos, { eager: true, onDelete: 'CASCADE' })
    @JoinColumn({ name: 'categoria_id' })
    categoria: Categoria;

    @ManyToOne(() => Dirigente, (dirigente) => dirigente.equipos, { eager: true, onDelete: 'CASCADE' })
    @JoinColumn({ name: 'dirigente_id' })
    dirigente: Dirigente;

    @ManyToOne(() => Campeonato, (campeonato) => campeonato.equipos, { eager: true, onDelete: 'CASCADE' })
    @JoinColumn({ name: 'campeonato_id' })
    campeonato: Campeonato;

    @ManyToOne(() => Fase, (fase) => fase.equipos, { eager: true, nullable: true })
    @JoinColumn({ name: 'fase_actual_id' })
    fase_actual: Fase;

    @ManyToOne(() => Grupo, (grupo) => grupo.equipos, { eager: true, nullable: true })
    @JoinColumn({ name: 'grupo_id' })
    grupo: Grupo;

    @OneToMany(() => Partido, (partido) => partido.equipo_1)
    partidos_1: Partido[];

    @OneToMany(() => Partido, (partido) => partido.equipo_2)
    partidos_2: Partido[];

    @OneToMany(() => Jugador, (jugador) => jugador.equipo, { cascade: true })
    jugador: Jugador[];

    @OneToMany(() => Gole, (gol) => gol.goles, { cascade: true })
    goles: Gole[];

    @OneToMany(() => Tarjeta, (tarjeta) => tarjeta.equipo)
    tarjetas: Tarjeta[];

    @OneToMany(() => Posicione, (posicion) => posicion.equipo)
    posiciones: Posicione[];


}
