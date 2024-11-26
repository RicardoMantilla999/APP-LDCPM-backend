import { IsNotEmpty } from "class-validator";

export class CreateGrupoDto {


    @IsNotEmpty({message:'El nombre es obligatorio'})
    nombre: string;

    @IsNotEmpty({message: "La Fase es obligatoria"})
    fase: number;

    

}
