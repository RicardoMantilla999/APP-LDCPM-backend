import { PartialType } from '@nestjs/mapped-types';
import { CreateArbitroDto } from './create-arbitro.dto';
import { IsEmail, IsNotEmpty, IsOptional, IsString, Matches, MaxLength, MinLength } from 'class-validator';
import { Transform } from 'class-transformer';

export class UpdateArbitroDto extends PartialType(CreateArbitroDto) {

    @IsOptional()
    id?: number;
    
    @IsString()
    @IsNotEmpty()
    @MinLength(10, { message: 'La cédula debe contener 10 dígitos' })
    @MaxLength(10, { message: 'La cédula debe contener 10 dígitos' })
    @Matches(/^[0-9]+$/, { message: 'La cédula debe contener solo dígitos' })
    cedula?: string;

    @IsString()
    @IsNotEmpty({message:'Los Nombres son obligatorios'})
    @Transform(({ value }) => value?.toUpperCase()) 
    nombres?: string;

    @IsString()
    @IsNotEmpty({message:'Los Apellidos son obligatorios'})
    @Transform(({ value }) => value?.toUpperCase()) 
    apellidos?: string;

    @IsString()
    @IsNotEmpty({message:'El telefono es obligatorio'})
    telefono?: string;

    @IsEmail({},{message:'El Email No es válido'})
    @IsNotEmpty({message:'El Email es obligatorio'})
    email?: string;

    @IsString()
    @IsNotEmpty({message:'La Dirección es obligatoria'})
    @Transform(({ value }) => value?.toUpperCase()) 
    direccion?: string;

    /**
    imagen: string;

     */


}
