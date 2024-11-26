import { Transform, Type } from "class-transformer";
import { IsBoolean, IsDate, IsEmpty, IsNotEmpty, IsNumber, IsOptional, IsString, Matches, MaxLength, MinLength } from "class-validator";

export class CreateDirigenteDto {

    @IsString()
    @IsNotEmpty()
    @MinLength(10, { message: 'La cédula debe contener 10 dígitos' })
    @MaxLength(10, { message: 'La cédula debe contener 10 dígitos' })
    @Matches(/^[0-9]+$/, { message: 'La cédula debe contener solo dígitos' })
    cedula: string;
    
    @IsString()
    @IsNotEmpty({ message: 'Los nombres son obligatorios' })
    @Transform(({ value }) => value?.toUpperCase()) 
    nombres: string;

    @IsString()
    @IsNotEmpty({ message: 'Los apellidos son obligatorios' })
    @Transform(({ value }) => value?.toUpperCase()) 
    apellidos: string;

    @IsString()
    @IsNotEmpty({ message: 'El teléfono es obligatorio' })
    telefono: string;

    @IsNumber()
    @IsNotEmpty({ message: 'El teléfono es obligatorio' })
    campeonato: number;
    /**
    equispo: 
     */
    @IsString()
    @IsNotEmpty({ message: 'Lugar de nacimiento obligatorio' })
    @Transform(({ value }) => value?.toUpperCase()) 
    lugar_nacimiento: string;

    @IsNotEmpty({ message: 'Elija la fecha de nacimiento' })
    @Type(() => Date)
    fecha_nacimiento: string;

    @IsBoolean()
    @IsOptional()
    suspendido?: boolean = false;


}
