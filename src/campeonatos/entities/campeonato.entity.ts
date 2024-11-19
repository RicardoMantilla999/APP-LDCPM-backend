import { Column, DeleteDateColumn, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class Campeonato {

    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    nombre: string;

    @Column()
    formato: string;

    @Column({type: 'date', nullable:true})
    fecha_inicio: Date;

    @Column({type: 'date', nullable:true})
    fecha_fin: Date;

    @DeleteDateColumn()
    deletedAt: Date;

}
