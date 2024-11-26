import { Campeonato } from "src/campeonatos/entities/campeonato.entity";
import { Sorteo } from "src/sorteos/entities/sorteo.entity";
import { Column, DeleteDateColumn, Entity, JoinColumn, ManyToOne, OneToMany, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class Categoria {

    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    categoria: string;

    @Column()
    descripcion: string;

    @ManyToOne(() => Campeonato, (campeonato) => campeonato.categorias, { eager: true ,onDelete: 'CASCADE' })
    campeonato: Campeonato;

    @OneToMany(() => Sorteo, (sorteo) => sorteo.categoria, { cascade: true })
    sorteo: Sorteo[];

}


