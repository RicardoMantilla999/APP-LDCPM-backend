import { Transform } from "class-transformer";
import { IsNotEmpty, IsOptional, IsString, MinLength } from "class-validator";

export class CreateCategoriaDto {


    @IsString()
    @IsNotEmpty({ message: 'La categoría es obligatoria' })
    @Transform(({ value }) => value?.toUpperCase()) 
    categoria: string;

    @IsString()
    @IsNotEmpty({ message: 'La descripción es obligatoria' })
    descripcion: string;

}
