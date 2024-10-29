import { PartialType } from '@nestjs/mapped-types';
import { CreateDirigenteDto } from './create-dirigente.dto';
import { IsBoolean, IsOptional, IsString } from 'class-validator';

export class UpdateDirigenteDto extends PartialType(CreateDirigenteDto) {

    
    @IsString()
    @IsOptional()
    cedula: string;
    
    @IsString()
    @IsOptional()
    nombres: string;

    @IsString()
    @IsOptional()
    apellidos: string;

    /**
    equispo: 
     */
    @IsString()
    @IsOptional()
    lugar_nacimiento: string;

    @IsString()
    @IsOptional()
    fecha_nacimiento: string;

    @IsBoolean()
    @IsOptional()
    suspendido: boolean = false;


}
