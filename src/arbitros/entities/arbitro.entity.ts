import { Column, DeleteDateColumn, Entity, PrimaryGeneratedColumn } from "typeorm";

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

    @DeleteDateColumn()  // Asegúrate de tener esta columna
    deletedAt: Date;

}
