import { PartialType } from '@nestjs/mapped-types';
import { CreateDirigenteDto } from './create-dirigente.dto';
import { IsBoolean, IsDate, IsNotEmpty, IsNumber, IsOptional, IsString } from 'class-validator';
import { Transform, Type } from 'class-transformer';

export class UpdateDirigenteDto extends PartialType(CreateDirigenteDto) {

    @IsOptional()
    id?: number;

    @IsString()
    @IsNotEmpty({ message: 'Cédula no puede ser vacío' })
    cedula?: string;
    
    @IsString()
    @IsNotEmpty({ message: 'Nombres no puede ser vacío' })
    @Transform(({ value }) => value?.toUpperCase()) 
    nombres?: string;

    @IsString()
    @IsNotEmpty({ message: 'Apellidos no puede ser vacío' })
    @Transform(({ value }) => value?.toUpperCase()) 
    apellidos?: string;

    @IsString()
    @IsNotEmpty({ message: 'Teléfono no puede ser vacío' })
    telefono?: string;


    @IsNumber()
    @IsNotEmpty({ message: 'El teléfono es obligatorio' })
    campeonato?; number;
  
    @IsString()
    @IsNotEmpty({ message: 'Lugar de nacimiento no puede ser vacío' })
    @Transform(({ value }) => value?.toUpperCase()) 
    lugar_nacimiento?: string;

    @IsNotEmpty({ message: 'Elija la fecha de nacimiento' })
    @IsDate()
    @Type(() => Date)
    fecha_nacimiento?: string;

    @IsBoolean()
    @IsOptional()
    suspendido?: boolean = false;


}
