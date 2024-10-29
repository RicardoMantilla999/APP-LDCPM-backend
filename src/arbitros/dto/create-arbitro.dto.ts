import { IsEmail, IsNotEmpty, IsString } from "class-validator";

export class CreateArbitroDto {

    @IsString()
    @IsNotEmpty()
    cedula: string;

    @IsString()
    @IsNotEmpty()
    nombres: string;

    @IsString()
    @IsNotEmpty()
    apellidos: string;

    @IsString()
    @IsNotEmpty()
    telefono: string;

    @IsEmail()
    @IsNotEmpty()
    email: string;

    @IsString()
    @IsNotEmpty()
    direccion: string;

    /**
    imagen: string;

     */



}
