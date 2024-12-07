import { PartialType } from '@nestjs/mapped-types';
import { CreateCategoriaDto } from './create-categoria.dto';
import { IsNotEmpty, IsNumber, IsOptional, IsString, MinLength } from 'class-validator';
import { Transform } from 'class-transformer';

export class UpdateCategoriaDto extends PartialType(CreateCategoriaDto) {

    @IsOptional()
    id?: number;

    @IsString()
    @IsNotEmpty({ message: 'La categoría es obligatoria' })
    @Transform(({ value }) => value?.toUpperCase()) 
    categoria?: string;

    @IsString()
    @IsNotEmpty({ message: 'La descripciónn es obligatoria' })
    descripcion?: string;

    @IsNumber()
    @IsOptional()
    fase_actual?: number;
    
    @IsNumber()
    @IsNotEmpty({message: 'Campeonato obligatorio'})
    campeonato: number;

}