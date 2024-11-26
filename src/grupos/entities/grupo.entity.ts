import { Fase } from "src/fases/entities/fase.entity";
import { Partido } from "src/partidos/entities/partido.entity";
import { Column, DeleteDateColumn, Entity, JoinColumn, ManyToOne, OneToMany, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class Grupo {

    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    nombre: string;

    @ManyToOne(()=> Fase, (fase) => fase.grupo,{eager:true, onDelete:'CASCADE'})
    @JoinColumn({ name: 'fase_id' })
    fase: Fase;

    @OneToMany(() => Partido, (partido) => partido.grupo, { cascade: true })
    partido: Partido[];

 
}
