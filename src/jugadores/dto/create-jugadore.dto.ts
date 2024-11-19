import { Transform, Type } from "class-transformer";
import { IsBoolean, IsDate, IsNotEmpty, IsNumber, IsOptional, IsString, Matches, MaxLength, MinLength } from "class-validator";
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

    @IsNotEmpty({message:'El Dorsal es obligatorio'})
    @IsNumber()
    dorsal: number;

    @IsNotEmpty({message:'Elija La Fecha de Nacimiento'})
    @Type(() => Date) 
    fecha_nacimiento: Date;

    @IsNotEmpty({message:'Lugar de Nacimiento es obligatorio'})
    @IsString()
    @Transform(({ value }) => value?.toUpperCase()) 
    lugar_nacimiento: string;

    @IsBoolean()
    @IsOptional()
    suspendido?: boolean = false;

    @IsNotEmpty({message:'Elija el Equipo'})
    @IsNumber()
    equipo: number;


}
