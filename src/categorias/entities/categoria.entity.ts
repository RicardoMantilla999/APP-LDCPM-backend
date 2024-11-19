import { Column, DeleteDateColumn, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class Categoria {

    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    categoria: string;

    @Column()
    descripcion: string;

    @DeleteDateColumn() 
    deletedAt: Date;

}


