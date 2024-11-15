import { Type } from "class-transformer";
import { IsDate, IsNotEmpty } from "class-validator";
import { Categoria } from "src/categorias/entities/categoria.entity";
import { Dirigente } from "src/dirigentes/entities/dirigente.entity";
import { Column, DeleteDateColumn, Entity, ManyToOne, PrimaryColumn, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class Equipo {

    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    nombre: string;

    @Column()
    uniforme: string;

    @ManyToOne(()=> Categoria, (cat) => cat.categoria,{eager: true})
    categoria: Categoria; 

    @ManyToOne(() => Dirigente, (dirigente) => dirigente.nombres,{eager: true})
    dirigente: Dirigente; 

    @Column({type: 'date', nullable:true})
    fecha_fundacion: Date;

    @DeleteDateColumn()  // Asegúrate de tener esta columna
    deletedAt: Date;
}
