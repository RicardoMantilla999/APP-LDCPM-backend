import { IsNotEmpty, IsNumber, IsString } from "class-validator";

export class CreateFaseDto {



    @IsString()
    @IsNotEmpty({ message: 'El nombre es obligatorio' })
    nombre: string;

    @IsNotEmpty({ message: 'El orden es obligatorio' })
    @IsNumber()
    orden: number;


    @IsNotEmpty({ message: 'Campeonato es obligatorio' })
    @IsNumber()
    campeonato: number;



}
