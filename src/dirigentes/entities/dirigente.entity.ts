import { Column, DeleteDateColumn, Entity, PrimaryGeneratedColumn } from "typeorm";

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

    @Column({nullable:true})
    telefono: string;

    /**
    equispo: 
     */
    @Column()
    lugar_nacimiento: string;

    @Column({type: 'date', nullable:true})
    fecha_nacimiento: Date;

    @Column()
    suspendido: boolean;

    @DeleteDateColumn()  // Asegúrate de tener esta columna
    deletedAt: Date;

}
