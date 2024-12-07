import { Campeonato } from "src/campeonatos/entities/campeonato.entity";
import { Categoria } from "src/categorias/entities/categoria.entity";
import { Gole } from "src/goles/entities/gole.entity";
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

    @OneToMany(() => Partido, (partido) => partido.fase, { cascade: true })
    partido: Partido[];

    @OneToMany(() => Categoria, (categoria) => categoria.fase_actual)
    categorias: Categoria[];

    @OneToMany(() => Gole, (gol) => gol.goles, { cascade: true })
    goles: Gole[];
}
