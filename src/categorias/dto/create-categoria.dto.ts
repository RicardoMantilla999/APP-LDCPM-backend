import { IsOptional, IsString, MinLength } from "class-validator";

export class CreateCategoriaDto {


    @IsString()
    @MinLength(1)
    categoria: string;

    @IsString()
    @IsOptional()
    descripcion: string;

}
