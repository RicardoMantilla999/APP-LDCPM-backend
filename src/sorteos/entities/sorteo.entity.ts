import { Categoria } from "src/categorias/entities/categoria.entity";
import { Equipo } from "src/equipos/entities/equipo.entity";
import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class Sorteo {

    @PrimaryGeneratedColumn()
    id: number;

    @ManyToOne(() => Equipo, (equipo) => equipo.sorteo, { eager: true, onDelete: 'CASCADE' })
    @JoinColumn({ name: 'equipo_id' })
    equipo: Equipo;

    @Column()
    nro_sorteo: number;

    @ManyToOne(() => Categoria, (categoria) => categoria.sorteo, { eager: true, onDelete: 'CASCADE' })
    @JoinColumn({ name: 'categoria_id' })
    categoria: Categoria;

}
