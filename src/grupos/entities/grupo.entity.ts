import { Fase } from "src/fases/entities/fase.entity";
import { Partido } from "src/partidos/entities/partido.entity";
import { Column, DeleteDateColumn, Entity, JoinColumn, ManyToOne, OneToMany, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class Grupo {

    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    nombre: string;

  
 
}
