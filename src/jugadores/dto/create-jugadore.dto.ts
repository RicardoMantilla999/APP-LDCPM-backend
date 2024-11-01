import { Type } from "class-transformer";
import { IsBoolean, IsDate, IsNotEmpty, IsNumber, IsOptional, IsString, Matches, MaxLength, MinLength } from "class-validator";
import { ManyToOne } from "typeorm";

export class CreateJugadoreDto {

    @IsNotEmpty()
    @IsString()
    @MinLength(10)
    @MaxLength(10)
    @Matches(/^[0-9]+$/, { message: 'La cédula debe contener solo dígitos' })
    cedula: string

    @IsNotEmpty()
    @IsString()
    @MinLength(5)
    nombres: string;

    @IsNotEmpty()
    @IsString()
    @MinLength(5)
    apellidos: string;

    @IsNotEmpty()
    @IsNumber()
    dorsal: number;

    @IsNotEmpty()
    @IsDate()
    @Type(() => Date) 
    fecha_nacimiento: Date;

    @IsNotEmpty()
    @IsString()
    @MinLength(5)
    lugar_nacimiento: string;

    @IsNotEmpty()
    @IsString()
    @MinLength(5)
    direccion: string;

    @IsBoolean()
    @IsOptional()
    suspendido?: boolean = false;

    @IsNotEmpty()
    @IsNumber()
    equipo: number;


}
