import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class Categoria {

    @PrimaryGeneratedColumn()
    id: number;

    @Column({ unique: true, nullable: false })
    categoria: string;

    @Column()
    descripcion: string;


}


