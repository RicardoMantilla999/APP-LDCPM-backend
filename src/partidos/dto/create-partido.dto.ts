import { Type } from "class-transformer";
import { IsBoolean, IsNotEmpty, IsNumber, IsOptional, IsString } from "class-validator";

export class CreatePartidoDto {
  
    @IsNotEmpty({message:'Equipo 1 es Oblligatorio'})
    @IsString()
    equipo_1: number;
  
    @IsNotEmpty({message:'Equipo 2 es Oblligatorio'})
    @IsString()
    equipo_2: number;
  
    @IsNumber()
    @IsOptional()
    goles_1?: number;
  
    @IsNumber()
    @IsOptional()
    goles_2?: number;
  
    @IsNotEmpty({message:'Fase es Oblligatorio'})
    fase: number;

    @IsNotEmpty({message: 'Categoria es obligatorio'})
    categoria: number;

    @IsNotEmpty({message: 'Nro de Fecha obligatorio'})
    @IsNumber()
    nro_fecha: number;
  
    @IsOptional()
    @Type(() => Date)
    fecha?: Date;
  
    @IsOptional()
    @IsString()
    hora?: string;
  
    @IsOptional() //Opciones: programado, postergado, cancelado, jugado.
    @IsBoolean()
    culminado?: boolean= false;


}
