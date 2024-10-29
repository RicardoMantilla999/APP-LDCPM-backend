import { Rol } from "src/common/enums/rol.enum";
import { Column, DeleteDateColumn, Entity, PrimaryGeneratedColumn } from "typeorm";


@Entity()
export class Usuario {

    @PrimaryGeneratedColumn()
    //@Column({ primary: true, generated: true })
    id: number;

    @Column({ unique: true, nullable: false })
    username: string;

    @Column({ nullable: false, select: false })
    password: string;

    @DeleteDateColumn()
    deletedAt: Date;

    @Column({ type: 'enum', default: Rol.USER, enum: Rol })
    rol: Rol;

}
