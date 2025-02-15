import { Transform, Type } from "class-transformer";
import { IsBoolean, IsDate, IsEmail, IsEnum, IsNotEmpty, IsNumber, IsOptional, IsString, Matches, MaxLength, MinLength } from "class-validator";
import { OrigenJugador } from "src/common/enums/origen.enum";
import { ManyToOne } from "typeorm";

export class CreateJugadoreDto {

    @IsNotEmpty()
    @IsString()
    @MinLength(10, { message: 'La cédula debe contener 10 dígitos' })
    @MaxLength(10, { message: 'La cédula debe contener 10 dígitos' })
    @Matches(/^[0-9]+$/, { message: 'La cédula debe contener solo dígitos' })
    cedula: string

    @IsNotEmpty({message:'Los Nombres son obligatorios'})
    @IsString()
    @MinLength(4,{message:'Ingrese dos Nombres'})
    @Transform(({ value }) => value?.toUpperCase()) 
    nombres: string;

    @IsNotEmpty({message:'Los Apellidos son obligatorios'})
    @IsString()
    @MinLength(4, {message:'Ingrese dos Apellidos'})
    @Transform(({ value }) => value?.toUpperCase()) 
    apellidos: string;

    @IsOptional()
    @Transform(({ value }) => parseInt(value, 10))
    @IsNumber({},{message: 'Dorsal debe ser un numero'})
    dorsal?: number;

    @IsNotEmpty({message:'Elija La Fecha de Nacimiento'})
    @IsDate()
    @Type(() => Date) 
    fecha_nacimiento: Date;

    @IsNotEmpty({message:'Cantón es obligatorio'})
    @IsString()
    @Transform(({ value }) => value?.toUpperCase()) 
    canton_juega: string;

    @IsNotEmpty({message:'Direccion es obligatorio'})
    @IsString()
    @Transform(({ value }) => value?.toUpperCase()) 
    direccion: string;

    @IsNotEmpty({message:'Telefono es obligatorio'})
    @IsString()
    telefono: string;

    @IsNotEmpty({message:'Email es obligatorio'})
    @IsEmail()
    email: string;

    @IsNotEmpty({message:'Origen es obligatorio'})
    @IsEnum(OrigenJugador)
    origen: OrigenJugador;

    @IsOptional()
    @IsString()
    foto?: string; // Ruta de la foto

    @IsNotEmpty({message:'Elija el Equipo'})
    @IsNumber({},{message: ' Equipo debe ser un numero'})
    @Transform(({ value }) => parseInt(value, 10))
    equipo: number;


}
