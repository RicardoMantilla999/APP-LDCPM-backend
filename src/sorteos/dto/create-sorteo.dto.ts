import { IsNotEmpty, IsNumber } from "class-validator";

export class CreateSorteoDto {


    @IsNotEmpty({message: 'equipo obligatorio'})
    @IsNumber()
    equipo: number;

    @IsNotEmpty({message: 'nro sorteo obligatorio'})
    @IsNumber()
    nro_sorteo: number;

    @IsNotEmpty({message: 'categoria obligatoria'})
    @IsNumber()
    categoria: number;


}
