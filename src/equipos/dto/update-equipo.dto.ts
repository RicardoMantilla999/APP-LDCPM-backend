import { PartialType } from '@nestjs/mapped-types';
import { CreateEquipoDto } from './create-equipo.dto';
import { IsDate, IsNotEmpty, IsNumber, IsOptional, IsString } from 'class-validator';
import { Transform, Type } from 'class-transformer';

export class UpdateEquipoDto extends PartialType(CreateEquipoDto) {

    @IsOptional()
    id?: number;

    @IsNotEmpty({message:'El Nombre es obligatorio'})
    @Transform(({ value }) => value?.toUpperCase()) 
    @IsString()
    nombre?: string;
  
    @IsNotEmpty({message:'El Uniforme es obligatorio'})
    @Transform(({ value }) => value?.toUpperCase()) 
    @IsString()
    uniforme?: string;
  
    @IsNotEmpty({message:'Elija la Categoría'})
    categoria?: number; // Se espera el ID de `Categoria`
  
    @IsNotEmpty({message:'Elija el Dirigente'})
    dirigente?: number; // Se espera el ID de `Dirigente`
  
    @IsNotEmpty({message:'Elija la Fecha de Fundación'})
    @Type(() => Date)
    fecha_fundacion?: Date;

    @IsNotEmpty({message:'Campeonato es obligatorio'})
    @IsNumber()
    campeonato?: number;

    @IsOptional()
    @IsNumber()
    nro_sorteo: number;
}
