import { Transform } from "class-transformer";
import { IsEmail, IsNotEmpty, IsOptional, IsString, MinLength } from "class-validator";
import { Rol } from "../../common/enums/rol.enum";

export class RegistrarDto{

    @Transform(({value}) => value.trim())
    @IsString()
    @IsNotEmpty()
    @MinLength(5)
    username: string;

    @Transform(({value}) => value.trim())
    @IsString()
    @IsNotEmpty()
    @IsEmail()
    email: string;

    @Transform(({value}) => value.trim())
    @IsString()
    @IsNotEmpty()
    @MinLength(5)
    password: string;

    @IsString()
    @IsOptional()
    rol: Rol.USER;

}