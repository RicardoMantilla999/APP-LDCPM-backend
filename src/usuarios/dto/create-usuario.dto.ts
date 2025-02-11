import { IsEmail, IsNotEmpty, IsOptional, IsString, MinLength } from "class-validator";
import { Rol } from "../../common/enums/rol.enum";

export class CreateUsuarioDto {

    @IsString()
    @IsNotEmpty()
    @MinLength(3)
    username: string;

    @IsString()
    @IsNotEmpty()
    @IsEmail()
    email: string;

    @IsString()
    @IsNotEmpty()
    @MinLength(5)
    password: string;

    @IsString()
    @IsOptional()
    rol?: Rol.USER;

}
