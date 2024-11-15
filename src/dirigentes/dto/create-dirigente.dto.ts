import { Type } from "class-transformer";
import { IsBoolean, IsDate, IsEmpty, IsNotEmpty, IsOptional, IsString } from "class-validator";

export class CreateDirigenteDto {

    @IsString()
    @IsNotEmpty()
    cedula: string;
    
    @IsString()
    @IsNotEmpty()
    nombres: string;

    @IsString()
    @IsNotEmpty()
    apellidos: string;

    /**
    equispo: 
     */
    @IsString()
    @IsNotEmpty()
    lugar_nacimiento: string;

    @IsNotEmpty()
    @IsDate()
    @Type(() => Date)
    fecha_nacimiento: Date;

    @IsBoolean()
    @IsOptional()
    suspendido?: boolean = false;


}
