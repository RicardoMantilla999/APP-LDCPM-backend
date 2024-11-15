import { PartialType } from '@nestjs/mapped-types';
import { CreateCategoriaDto } from './create-categoria.dto';
import { IsOptional, IsString, MinLength } from 'class-validator';

export class UpdateCategoriaDto extends PartialType(CreateCategoriaDto) {

    @IsOptional()
    id?: number;

    @IsString()
    @MinLength(1)
    @IsOptional()
    categoria?: string;

    @IsString()
    @IsOptional()
    descripcion?: string;

}