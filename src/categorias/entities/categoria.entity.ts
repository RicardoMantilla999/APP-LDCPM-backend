import { Campeonato } from "src/campeonatos/entities/campeonato.entity";
import { Equipo } from "src/equipos/entities/equipo.entity";
import { Fase } from "src/fases/entities/fase.entity";
import { Gole } from "src/goles/entities/gole.entity";
import { Partido } from "src/partidos/entities/partido.entity";
import { Column, DeleteDateColumn, Entity, JoinColumn, ManyToOne, OneToMany, OneToOne, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class Categoria {

    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    categoria: string;

    @Column()
    descripcion: string;

    @ManyToOne(() => Fase, (fase) => fase.categorias, { eager: true, nullable: true })
    @JoinColumn({ name: 'fase_actual_id' })
    fase_actual: Fase;
    

    @ManyToOne(() => Campeonato, (campeonato) => campeonato.categorias, { eager: true ,onDelete: 'CASCADE' })
    campeonato: Campeonato;


    @OneToMany(() => Partido, (partido) => partido.categoria, { cascade: true })
    partido: Partido[];
    
    @OneToMany(() => Gole, (gol) => gol.goles, { cascade: true })
    goles: Gole[];
    
    @OneToMany(() => Equipo, (equipo) => equipo.categoria, { cascade: true })
    categorias: Equipo[];
}


