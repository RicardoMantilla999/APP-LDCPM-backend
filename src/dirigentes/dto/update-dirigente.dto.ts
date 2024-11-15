import { PartialType } from '@nestjs/mapped-types';
import { CreateDirigenteDto } from './create-dirigente.dto';
import { IsBoolean, IsDate, IsOptional, IsString } from 'class-validator';
import { Type } from 'class-transformer';

export class UpdateDirigenteDto extends PartialType(CreateDirigenteDto) {

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

    /**
    equispo: 
     */
    @IsString()
    @IsOptional()
    lugar_nacimiento?: string;

    @IsOptional()
    @IsDate()
    @Type(() => Date)
    fecha_fundacion?: Date;

    @IsBoolean()
    @IsOptional()
    suspendido?: boolean = false;


}
