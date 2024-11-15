import { PartialType } from '@nestjs/mapped-types';
import { CreateJugadoreDto } from './create-jugadore.dto';
import { IsBoolean, IsDate, IsNumber, IsOptional, IsString, Matches, MaxLength, MinLength } from 'class-validator';
import { Type } from 'class-transformer';

export class UpdateJugadoreDto extends PartialType(CreateJugadoreDto) {

    @IsOptional()
    id?: number;

    @IsOptional()
    @IsString()
    @MinLength(10)
    @MaxLength(10)
    @Matches(/^[0-9]+$/, { message: 'La cédula debe contener solo dígitos' })
    cedula?: string;

    @IsOptional()
    @IsString()
    @MinLength(5)
    nombres?: string;

    @IsOptional()
    @IsString()
    @MinLength(5)
    apellidos?: string;

    @IsOptional()
    @IsNumber()
    dorsal?: number;

    @IsOptional()
    @IsDate()
    @Type(() => Date) 
    fecha_nacimiento?: Date;

    @IsOptional()
    @IsString()
    @MinLength(5)
    lugar_nacimiento?: string;

    @IsOptional()
    @IsString()
    @MinLength(5)
    direccion?: string;


    @IsBoolean()
    @IsOptional()
    suspendido?: boolean = false;

    @IsOptional()
    equipo?: number;


}
