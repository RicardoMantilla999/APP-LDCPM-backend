import { PartialType } from '@nestjs/mapped-types';
import { CreateJugadoreDto } from './create-jugadore.dto';
import { IsBoolean, IsDate, IsEmail, IsEnum, IsInt, IsNotEmpty, IsNumber, IsOptional, IsString, Matches, MaxLength, MinLength, ValidateIf } from 'class-validator';
import { Transform, Type } from 'class-transformer';
import { OrigenJugador } from 'src/common/enums/origen.enum';

export class UpdateJugadoreDto extends PartialType(CreateJugadoreDto) {

    @IsOptional()
    id?: number;

    @IsOptional()
    @IsString()
    @MinLength(10, { message: 'La cédula debe contener 10 dígitos' })
    @MaxLength(10, { message: 'La cédula debe contener 10 dígitos' })
    @Matches(/^[0-9]+$/, { message: 'La cédula debe contener solo dígitos' })
    cedula?: string;

    @IsOptional()
    @IsString()
    @MinLength(5, { message: 'Ingrese dos Nombres' })
    @Transform(({ value }) => value?.toUpperCase())
    nombres?: string;

    @IsOptional()
    @IsString()
    @MinLength(5, { message: 'Ingrese dos Apellidos' })
    @Transform(({ value }) => value?.toUpperCase())
    apellidos?: string;

    @IsOptional()
    @ValidateIf((obj) => obj.dorsal !== null) // Solo valida si no es null
    dorsal?: number | null;


    @IsOptional()
    @IsDate()
    @Type(() => Date)
    fecha_nacimiento?: Date;


    @IsOptional()
    @IsString()
    @Transform(({ value }) => value?.toUpperCase())
    canton_juega?: string;

    @IsOptional()
    @IsString()
    @Transform(({ value }) => value?.toUpperCase())
    direccion?: string;

    @IsOptional()
    @IsString()
    telefono?: string;

    @IsOptional()
    @IsEmail()
    email?: string;

    @IsOptional()
    @IsString()
    foto?: string;

    @IsOptional()
    @IsEnum(OrigenJugador)
    origen?: OrigenJugador;


    @IsOptional()
    equipo?: number;


}
