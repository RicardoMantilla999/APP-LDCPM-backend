import { Type } from "class-transformer";
import { IsDate, IsNotEmpty, IsString } from "class-validator";

export class CreateEquipoDto {

  
    @IsNotEmpty()
    @IsString()
    nombre: string;
  
    @IsNotEmpty()
    @IsString()
    uniforme: string;
  
    @IsNotEmpty()
    categoria: number; // Se espera el ID de `Categoria`
  
    @IsNotEmpty()
    dirigente: number; // Se espera el ID de `Dirigente`
  
    @IsNotEmpty()
    @IsDate()
    @Type(() => Date)
    fecha_fundacion: Date;


}
