import { PartialType } from '@nestjs/mapped-types';
import { CreateArbitroDto } from './create-arbitro.dto';
import { IsEmail, IsOptional, IsString } from 'class-validator';

export class UpdateArbitroDto extends PartialType(CreateArbitroDto) {

    @IsOptional()
    id?: number;
    
    @IsString()
    @IsOptional()
    cedula?: string;

    @IsString()
    @IsOptional()
    nombres?: string;

    @IsString()
    @IsOptional()
    apellidos?: string;

    @IsString()
    @IsOptional()
    telefono?: string;

    @IsEmail()
    @IsOptional()
    email?: string;

    @IsString()
    @IsOptional()
    direccion?: string;

    /**
    imagen: string;

     */


}
