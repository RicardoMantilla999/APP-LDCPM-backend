import { PartialType } from '@nestjs/mapped-types';
import { CreateJugadoreDto } from './create-jugadore.dto';
import { IsBoolean, IsDate, IsNotEmpty, IsNumber, IsOptional, IsString, Matches, MaxLength, MinLength } from 'class-validator';
import { Transform, Type } from 'class-transformer';

export class UpdateJugadoreDto extends PartialType(CreateJugadoreDto) {

    @IsOptional()
    id?: number;

    @IsOptional()
    @IsString()
    @MinLength(10, { message: 'La cédula debe contener 10 dígitos' })
    @MaxLength(10, { message: 'La cédula debe contener 10 dígitos' })
    @Matches(/^[0-9]+$/, { message: 'La cédula debe contener solo dígitos' })
    cedula?: string;

    @IsNotEmpty({message:'Los Nombres son obligatorios'})
    @IsString()
    @MinLength(5, {message:'Ingrese dos Nombres'})
    @Transform(({ value }) => value?.toUpperCase()) 
    nombres?: string;

    @IsNotEmpty({message:'Los Nombres son obligatorios'})
    @IsString()
    @MinLength(5, {message:'Ingrese dos Apellidos'})
    @Transform(({ value }) => value?.toUpperCase()) 
    apellidos?: string;

    @IsNotEmpty({message:'El Dorsal es obligatorio'})
    @IsNumber()
    dorsal?: number;

    @IsNotEmpty({message:'Elija la Fecha de Nacimiento'})
    @IsDate()
    @Type(() => Date) 
    fecha_nacimiento?: Date;

    @IsNotEmpty({message:'Lugar de Nacimiento obligatorio'})
    @IsString()
    @MinLength(5)
    @Transform(({ value }) => value?.toUpperCase()) 
    lugar_nacimiento?: string;

    @IsBoolean()
    @IsOptional()
    suspendido?: boolean = false;

    @IsOptional()
    equipo?: number;


}
