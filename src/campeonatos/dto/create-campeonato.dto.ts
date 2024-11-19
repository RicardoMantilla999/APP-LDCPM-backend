import { Transform, Type } from "class-transformer";
import { IsDate, IsNotEmpty, IsString } from "class-validator";

export class CreateCampeonatoDto {


    @IsString()
    @IsNotEmpty({message: 'El nombre es obligatorio'})
    @Transform(({ value }) => value?.toUpperCase()) 
    nombre: string;

    @IsString()
    @IsNotEmpty({message: 'El formato es obligatorio'})
    @Transform(({ value }) => value?.toUpperCase()) 
    formato: string;

    @IsNotEmpty({message: 'La Fecha es obligatorio'})
    @Type(() => Date)
    fecha_inicio: Date;

    @IsNotEmpty({message: 'La Fecha es obligatorio'})
    @Type(() => Date)
    fecha_fin: Date;


}
