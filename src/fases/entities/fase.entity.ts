import { Campeonato } from "src/campeonatos/entities/campeonato.entity";
import { Grupo } from "src/grupos/entities/grupo.entity";
import { Partido } from "src/partidos/entities/partido.entity";
import { Column, DeleteDateColumn, Entity, JoinColumn, ManyToOne, OneToMany, PrimaryColumn, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class Fase {

    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    nombre: string;

    @Column()
    orden: number;


    @ManyToOne(() => Campeonato, (campeonato) => campeonato.fases, { eager: true, onDelete: 'CASCADE' })
    @JoinColumn({ name: 'campeonato_id' })
    campeonato: Campeonato;

    @OneToMany(() => Grupo, (grupo) => grupo.fase, { cascade: true })
    grupo: Grupo[];

    @OneToMany(() => Partido, (partido) => partido.fase, { cascade: true })
    partido: Partido[];

}
