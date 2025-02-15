import { Transform, Type } from "class-transformer";
import { IsDate, IsNotEmpty, IsNumber, IsString } from "class-validator";

export class CreateCampeonatoDto {


    @IsString()
    @IsNotEmpty({message: 'El nombre es obligatorio'})
    @Transform(({ value }) => value?.toUpperCase()) 
    nombre: string;


    @IsNotEmpty({message: 'La Fecha es obligatorio'})
    @IsDate()
    @Type(() => Date)
    fecha_inicio: Date;

    @IsNotEmpty({message: 'La Fecha es obligatorio'})
    @IsDate()
    @Type(() => Date)
    fecha_fin: Date;


    

}
