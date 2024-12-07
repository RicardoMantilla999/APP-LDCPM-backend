import { Transform, Type } from "class-transformer";
import { IsDate, IsNotEmpty, isNumber, IsNumber, IsOptional, IsString } from "class-validator";

export class CreateEquipoDto {


    @IsNotEmpty({ message: 'El Nombre es obligatorio' })
    @Transform(({ value }) => value?.toUpperCase())
    @IsString()
    nombre: string;

    @IsNotEmpty({ message: 'El Uniforme es obligatorio' })
    @Transform(({ value }) => value?.toUpperCase())
    @IsString()
    uniforme: string;

    @IsNotEmpty({ message: 'Elija la Categoría' })
    categoria: number; // Se espera el ID de `Categoria`

    @IsNotEmpty({ message: 'Elija el Dirigente' })
    dirigente: number; // Se espera el ID de `Dirigente`

    @IsNotEmpty({ message: 'Elija la Fecha de Fundación' })
    @IsDate()
    @Type(() => Date)
    fecha_fundacion: Date;

    @IsNotEmpty({ message: 'Campeonato es obligatorio' })
    @IsNumber()
    campeonato: number;

    @IsOptional()
    @IsNumber()
    nro_sorteo: number;


}
