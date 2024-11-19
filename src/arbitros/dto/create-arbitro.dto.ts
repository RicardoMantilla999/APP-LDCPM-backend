import { Transform } from "class-transformer";
import { IsEmail, IsNotEmpty, IsString, Matches, MaxLength, MinLength } from "class-validator";
import { IsCedulaEcuatoriana } from "src/common/decorators/isCedulaEcuatoriana.decorator";

export class CreateArbitroDto {

    @IsString()
    @IsNotEmpty({message: "La Cédula es obligatoria"})
    @IsCedulaEcuatoriana({message:"La Cédula ingresada no es Válida"})
    cedula: string;

    @IsString()
    @IsNotEmpty({message:'Los Nombres son obligatorios'})
    @Transform(({ value }) => value?.toUpperCase()) 
    nombres: string;

    @IsString()
    @IsNotEmpty({message:'Los Apellidos son obligatorios'})
    @Transform(({ value }) => value?.toUpperCase()) 
    apellidos: string;

    @IsString()
    @IsNotEmpty({message:'El Teléfono es obligatorio'})
    telefono: string;

    @IsEmail({},{message:'El Email No es válido'})
    @IsNotEmpty({message:'El Email es obligatorio'})
    email: string;

    @IsString()
    @IsNotEmpty({message:'La Dirección es obligatoria'})
    @Transform(({ value }) => value?.toUpperCase()) 
    direccion: string;

    /**
    imagen: string;

     */



}
