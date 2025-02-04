import { Equipo } from "src/equipos/entities/equipo.entity";
import { Fase } from "src/fases/entities/fase.entity";
import { Partido } from "src/partidos/entities/partido.entity";
import { Posicione } from "src/posiciones/entities/posicione.entity";
import { Column, DeleteDateColumn, Entity, JoinColumn, ManyToOne, OneToMany, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class Grupo {

    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    nombre: string;

    @OneToMany(() => Equipo, (equipo) => equipo.grupo)
    equipos: Equipo[];
    
    @OneToMany(() => Posicione, (posicion) => posicion.grupo)
    posiciones: Posicione[];
  
 
}
