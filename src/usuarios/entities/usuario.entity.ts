import { Rol } from "src/common/enums/rol.enum";
import { Column, DeleteDateColumn, Entity, PrimaryGeneratedColumn } from "typeorm";


@Entity()
export class Usuario {

    @PrimaryGeneratedColumn()
    //@Column({ primary: true, generated: true })
    id: number;

    @Column({ nullable: false })
    username: string;

    @Column({ unique: true, nullable: false })
    email: string;

    @Column({ nullable: false, select: false })
    password: string;

    @Column({ type: 'enum', default: Rol.USER, enum: Rol })
    rol: Rol;

    @DeleteDateColumn()
    deletedAt?: Date;

}
