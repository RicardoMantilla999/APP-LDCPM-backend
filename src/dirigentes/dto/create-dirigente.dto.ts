import { IsBoolean, IsEmpty, IsNotEmpty, IsOptional, IsString } from "class-validator";

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

    @IsString()
    @IsNotEmpty()
    fecha_nacimiento: string;

    @IsBoolean()
    @IsOptional()
    suspendido: boolean = false;


}
