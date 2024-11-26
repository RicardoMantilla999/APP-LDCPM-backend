import { Arbitro } from "src/arbitros/entities/arbitro.entity";
import { Categoria } from "src/categorias/entities/categoria.entity";
import { Dirigente } from "src/dirigentes/entities/dirigente.entity";
import { Equipo } from "src/equipos/entities/equipo.entity";
import { Fase } from "src/fases/entities/fase.entity";
import { Column, DeleteDateColumn, Entity, OneToMany, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class Campeonato {

    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    nombre: string;

    @Column()
    formato: string;

    @Column({ type: 'date', nullable: true })
    fecha_inicio: Date;

    @Column({ type: 'date', nullable: true })
    fecha_fin: Date;

    @OneToMany(() => Fase, (fase) => fase.campeonato, { cascade: true })
    fases: Fase[];

    @OneToMany(() => Categoria, (categoria) => categoria.campeonato, { cascade: true })
    categorias: Categoria[];

    @OneToMany(() => Equipo, (equipo) => equipo.campeonato, { cascade: true })
    equipos: Equipo[];

    @OneToMany(() => Dirigente, (dirigente) => dirigente.campeonato, { cascade: true })
    dirigentes: Dirigente[];

    @OneToMany(() => Arbitro, (arbitro) => arbitro.campeonato, { cascade: true })
    arbitros: Arbitro[];
}
