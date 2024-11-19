import { PartialType } from '@nestjs/mapped-types';
import { CreateCampeonatoDto } from './create-campeonato.dto';
import { IsDate, IsNotEmpty, IsOptional, IsString } from 'class-validator';
import { Transform, Type } from 'class-transformer';

export class UpdateCampeonatoDto extends PartialType(CreateCampeonatoDto) {


    @IsOptional()
    id?: number;

    @IsString()
    @IsNotEmpty({message: 'El Nombre es obligatorio'})
    @Transform(({ value }) => value?.toUpperCase()) 
    nombre: string;

    @IsString()
    @IsNotEmpty({message: 'El Formato es obligatorio'})
    @Transform(({ value }) => value?.toUpperCase()) 
    formato: string;

    @IsNotEmpty({message: 'La Fecha Inicio es obligatorio'})
    @Type(() => Date)
    fecha_inicio: Date;

    @IsNotEmpty({message: 'La Fecha Fin es obligatorio'})
    @IsDate()
    fecha_fin: Date;


}
