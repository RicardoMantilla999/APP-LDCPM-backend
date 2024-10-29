import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class Dirigente {

    
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    cedula: string;
    
    @Column()
    nombres: string;

    @Column()
    apellidos: string;

    /**
    equispo: 
     */
    @Column()
    lugar_nacimiento: string;

    @Column()
    fecha_nacimiento: string;

    @Column()
    suspendido: boolean;


}
