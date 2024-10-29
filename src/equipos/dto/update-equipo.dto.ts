import { PartialType } from '@nestjs/mapped-types';
import { CreateEquipoDto } from './create-equipo.dto';
import { IsDate, IsOptional, IsString } from 'class-validator';
import { Type } from 'class-transformer';

export class UpdateEquipoDto extends PartialType(CreateEquipoDto) {

    @IsOptional()
    @IsString()
    nombre?: string;
  
    @IsOptional()
    @IsString()
    uniforme?: string;
  
    @IsOptional()
    categoria?: number; // Se espera el ID de `Categoria`
  
    @IsOptional()
    dirigente?: number; // Se espera el ID de `Dirigente`
  
    @IsOptional()
    @IsDate()
    @Type(() => Date)
    fecha_fundacion?: Date;
}
