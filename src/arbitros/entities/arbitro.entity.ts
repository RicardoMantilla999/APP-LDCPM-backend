import { Campeonato } from "src/campeonatos/entities/campeonato.entity";
import { Column, DeleteDateColumn, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class Arbitro {

    @PrimaryGeneratedColumn()
    id : number;

    @Column()
    cedula: string;

    @Column()
    nombres: string;

    @Column()
    apellidos: string;

    @Column()
    telefono: string;

    @Column()
    email: string;

    @Column()
    direccion: string;

    /**
    imagen: string;

     */

    @ManyToOne(() => Campeonato, (campeonato) => campeonato.arbitros, { onDelete: 'CASCADE' })
    @JoinColumn({ name: 'campeonato_id' })
    campeonato: Campeonato;

}
